import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Grid,
  FormControl,
  OutlinedInput,
  Select,
  InputAdornment,
  TextField,
  DialogContentText
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import Controls from 'src/components/controls/index';
import SearchIcon from '@material-ui/icons/Search';
import {
  getLevel2Categorieslist,
  getLevel3Categorieslist
} from 'src/components/Helpers/BusinessCategoriesQueryHelper';
import {
  getAllProductsData,
  isProductAvailable
} from 'src/components/Helpers/dbQueries/businessproduct';
import { RemoveCircle, AddCircle } from '@material-ui/icons';
import * as Bd from 'src/components/SelectedBusiness';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FFFFFF',
    color: '#CCCCCC'
  },
  avatar: {
    width: 60,
    height: 60
  },
  toolbar: {
    minHeight: '20px'
  },
  typography: {
    position: 'absolute',
    paddingRight: 0,
    paddingLeft: '3%',
    fontFamily: 'Nunito Sans Roboto sans-serif',
    color: '#303030',
    fontSize: 12
  },
  text: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12
  },
  logout: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  selectOption: {
    // float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
  },
  formControl: {
    minWidth: 200
  },
  selectFont: {
    fontSize: '14px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  resetbtn: {
    marginLeft: 30
  },
  centered: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  buttonFocus: {
    '&:focus': {
      border: '1px solid'
    }
  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    fontSize: '12px',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    }
  },
  notactiveClass: {
    border: '1px solid black',
    margin: '5px'
  },
  activeClass: {
    border: '1px solid rgb(157, 203, 106)',
    margin: '5px',
    color: 'rgb(157, 203, 106)'
  },
  tooltip: {
    position: 'relative',
    display: 'inline-block',
    borderBottom: '1px dotted black',
    '&:hover $tooltiptext': {
      visibility: 'visible'
    }
  },
  tooltiptext: {
    visibility: 'hidden',
    width: 120,
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: 6,
    position: 'absolute',
    zIndex: 1,
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)'
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
  }
}));

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const SaleQuotationProductDetails = (props) => {
  const classes = useStyles();
  const stores = useStore();

  const { openProductDetails, items } = toJS(stores.SalesQuotationAddStore);
  const {
    handleCloseProductDetails,
    selectProduct,
    addNewItem,
    setQuantity,
    deleteItem
  } = stores.SalesQuotationAddStore;

  const [level2CategoriesList, setLevel2CategoriesList] = useState([]);
  const [level3CategoriesList, setLevel3CategoriesList] = useState([]);
  const [category, setCategory] = React.useState();
  const [subCategory, setSubCategory] = React.useState();
  const [productList, setProductList] = React.useState([]);
  const [subCategoryName, setSubCategoryName] = React.useState('');

  const saveProductDetails = async () => {
    handleCloseProductDetails();
  };

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  useEffect(() => {
    async function fetchData() {
      let level2List = await getLevel2Categorieslist();
      const businessData = await Bd.getBusinessData();

      if (
        String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() ===
        'true'
      ) {
        level2List = level2List.filter(
          (item) => item.name === 'restaurant_level2'
        );
        setLevel2CategoriesList(level2List);
      } else {
        let newList = [];
        for (let l2 of level2List) {
          const isAvail = await isProductAvailable({
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { 'categoryLevel2.name': { $eq: l2.name } }
            ]
          });
          if (isAvail === true) {
            newList.push(l2);
          }
        }
        setLevel2CategoriesList(newList);
      }

      if (
        String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() ===
        'true'
      ) {
        handleChange(level2List[0]);
      }
    }

    fetchData();
  }, []);

  const handleChange = async (event) => {
    setProductList([]);
    setCategory(event);
    const businessData = await Bd.getBusinessData();
    let level3List = await getLevel3Categorieslist(event.name);
    let newList = [];
    for (let l3 of level3List) {
      const isAvail = await isProductAvailable({
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'categoryLevel3.name': { $eq: l3.name } }
        ]
      });
      if (isAvail === true) {
        newList.push(l3);
      }
    }
    setLevel3CategoriesList(newList);
  };

  const handleChangeSubCategory = async (event) => {
    setProductList([]);
    let subC = event;
    setSubCategory(event);
    const businessData = await Bd.getBusinessData();
    let prodsData = [];
    if (subC) {
      console.log(subC);
      setSubCategoryName(subC.name);
      prodsData = await getAllProductsData({
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'categoryLevel3.name': { $eq: subC.name } }
        ]
      });
      filterAndSetData(prodsData);
    } else {
      setProductList([]);
    }
  };

  const resetCategory = async () => {
    setCategory();
    setSubCategory();
    setLevel3CategoriesList([]);
    setProductList([]);
  };

  const handleSearch = async (e) => {
    if (e) {
      setProductList([]);
      let target = e.target.value.toLowerCase();
      if (target.length > 0) {
        var regexp = new RegExp('^.*' + target + '.*$', 'i');

        const businessData = await Bd.getBusinessData();
        let prodsData = [];
        if (subCategory) {
          prodsData = await getAllProductsData({
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { name: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { brand: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { barcode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { salePrice: { $eq: parseFloat(target) } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { hsn: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { sku: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { shortCutCode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { modelNo: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              }
            ]
          });
        } else {
          prodsData = await getAllProductsData({
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { name: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { brand: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { barcode: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { salePrice: { $eq: parseFloat(target) } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { hsn: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { sku: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { shortCutCode: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { modelNo: { $regex: regexp } }
                ]
              }
            ]
          });
        }
        filterAndSetData(prodsData);
      } else {
        const businessData = await Bd.getBusinessData();
        let prodsData = [];
        if (subCategory) {
          prodsData = await getAllProductsData({
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { name: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { brand: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { barcode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { salePrice: { $eq: parseFloat(target) } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { hsn: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { sku: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { shortCutCode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { modelNo: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              }
            ]
          });
        }
        filterAndSetData(prodsData);
      }
    }
  };

  const filterAndSetData = async (prodsData) => {
    if (items && items.length > 0) {
      for (let item of prodsData) {
        item.qty = 0;
        for (let i = 0; i < items.length; i++) {
          if (items[i].product_id === item.productId) {
            item.qty += items[i].qty;
            item.productIndex = i;
          }
        }
      }
      setProductList(prodsData);
    } else {
      setProductList(prodsData);
    }
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="lg"
        height={1000}
        open={openProductDetails}
        onClose={() => handleCloseProductDetails()}
      >
        <DialogContent style={{ height: '500px' }}>
          <Grid container direction="row" alignItems="stretch">
            {String(
              localStorage.getItem('isHotelOrRestaurant')
            ).toLowerCase() === 'false' && (
              <>
                <div style={{ width: '20%' }} className={classes.selectOption}>
                  <FormControl required className={clsx(classes.formControl)}>
                    <Select
                      displayEmpty
                      value={category ? category.displayName : ''}
                      disableUnderline
                      className={classes.selectFont}
                      input={
                        <OutlinedInput
                          style={{ width: '100%', height: '60%' }}
                        />
                      }
                    >
                      <MenuItem disabled value="">
                        Choose Category
                      </MenuItem>
                      {level2CategoriesList.map((c) => (
                        <MenuItem
                          key={c.name}
                          value={c.displayName}
                          name={c.name}
                          onClick={() => handleChange(c)}
                        >
                          {c.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div style={{ width: '20%' }} className={classes.selectOption}>
                  <Button
                    className={classes.resetbtn}
                    size="small"
                    onClick={resetCategory}
                    color="secondary"
                  >
                    Reset Categories
                  </Button>
                </div>
                <div
                  style={{ width: '50%', marginLeft: '10%', marginTop: '-4px' }}
                  className={classes.selectOption}
                >
                  <Controls.Input
                    placeholder="Search By Item Name/Barcode/Model No/Serial No/Brand"
                    size="small"
                    style={{ width: '100%' }}
                    InputProps={{
                      classes: {
                        root: classes.searchInputRoot,
                        input: classes.searchInputInput
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                    onChange={handleSearch}
                  />
                </div>
              </>
            )}

            <Grid container>
              <div className={classes.centered} style={{ marginTop: '10px' }}>
                {level3CategoriesList &&
                  level3CategoriesList.map((option) => (
                    <Button
                      onClick={(e) => handleChangeSubCategory(option)}
                      className={
                        subCategoryName == option.name
                          ? classes.activeClass
                          : classes.notactiveClass
                      }
                    >
                      {option.displayName}
                    </Button>
                  ))}
              </div>
            </Grid>

            {String(
              localStorage.getItem('isHotelOrRestaurant')
            ).toLowerCase() === 'true' && (
              <Grid container>
                <Controls.Input
                  placeholder="Search By Item Name"
                  size="small"
                  fullWidth
                  InputProps={{
                    classes: {
                      root: classes.searchInputRoot,
                      input: classes.searchInputInput
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  onChange={handleSearch}
                />
              </Grid>
            )}

            <Grid container fullWidth>
              {productList &&
                productList.length > 0 &&
                productList.map((option, index) => (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      style={{ textAlign: 'center', padding: '10px' }}
                    >
                      <div
                        style={{
                          width: '100%',
                          margin: '12px',
                          border: '1px solid #8080805e'
                          // borderBottom: '2px'
                        }}
                      >
                        <div style={{ margin: '5px' }}>
                          <img
                            alt="ProdImage"
                            src={
                              option.imageUrl !== '' && option.imageUrl !== null
                                ? option.imageUrl
                                : 'https://firebasestorage.googleapis.com/v0/b/oneshell-d3a18.appspot.com/o/general_images%2Fno_product_image.jpeg?alt=media&token=6a37ec8e-c327-4069-bdba-48f8e60bd68a'
                            }
                            width="50%"
                            height="50%"
                            style={{
                              minHeight: '100px',
                              minWidth: '100px',
                              maxHeight: '100px',
                              maxWidth: '100px'
                            }}
                          />
                        </div>
                        <div style={{ margin: '5px' }}>
                          <div className={classes.tooltip}>
                            <Typography
                              variant="h6"
                              style={{
                                fontSize: '12px',
                                minHeight: '43px',
                                fontWeight: 'bold'
                              }}
                            >
                              {option.name.length > 50
                                ? option.name.slice(0, 50) + '...'
                                : option.name}
                            </Typography>
                            <span className={classes.tooltiptext}>
                              {option.name}
                            </span>
                          </div>
                        </div>
                        <div style={{ margin: '5px' }}>
                          <Typography variant="h6" style={{ fontSize: '14px' }}>
                            {option.salePrice}
                          </Typography>
                        </div>
                        <div style={{ margin: '5px', marginTop: '10px' }}>
                          {option.qty ? (
                            <div
                              style={{ display: 'flex', flexDirection: 'row' }}
                            >
                              <div style={{ width: '30%' }}>
                                <IconButton
                                  variant="outlined"
                                  color="secondary"
                                  style={{ padding: '3px' }}
                                >
                                  <RemoveCircle
                                    style={{ fontSize: '25px' }}
                                    onClick={async (e) => {
                                      if (
                                        option.batchData &&
                                        option.batchData.length > 0
                                      ) {
                                        setErrorAlertProductMessage(
                                          'Deleting Batches not supported from search screen. Please perform from main Billing screen!!'
                                        );
                                        setErrorAlertProduct(true);
                                        return;
                                      }
                                      option.qty = option.qty - 1;
                                      if (option.qty === 0) {
                                        await deleteItem(option.productIndex);
                                        option.productIndex = -1;
                                        filterAndSetData(productList);
                                      } else {
                                        setQuantity(
                                          option.productIndex,
                                          option.qty
                                        );
                                      }
                                    }}
                                  />
                                </IconButton>
                              </div>
                              <div
                                style={{ width: '40%', alignSelf: 'center' }}
                              >
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  type="number"
                                  size="small"
                                  value={option.qty ? option.qty : 0}
                                  onChange={(e) => {
                                    if (e.target.value > 0) {
                                      option.qty = parseFloat(
                                        e.target.value || 0
                                      );
                                      setQuantity(
                                        option.productIndex,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  className={clsx(classes.inputNumber)}
                                  InputProps={{
                                    inputProps: {
                                      min: 0,
                                      style: {
                                        padding: '6px',
                                        textAlign: 'center',
                                        fontSize: '14px'
                                      }
                                    }
                                  }}
                                />
                              </div>
                              <div style={{ width: '30%' }}>
                                <IconButton
                                  variant="outlined"
                                  color="secondary"
                                  style={{ padding: '3px' }}
                                >
                                  <AddCircle
                                    style={{ fontSize: '25px' }}
                                    onClick={async (e) => {
                                      if (
                                        option.batchData &&
                                        option.batchData.length > 0
                                      ) {
                                        await addNewItem(true, false);
                                        await selectProduct(
                                          option,
                                          items.length - 1,
                                          false
                                        );
                                        option.productIndex = items.length - 1;
                                      } else {
                                        await selectProduct(
                                          option,
                                          option.productIndex,
                                          false
                                        );
                                      }

                                      option.qty = option.qty + 1;
                                    }}
                                  />
                                </IconButton>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={async (e) => {
                                let index = items ? items.length - 1 : -1;
                                if (
                                  index === -1 ||
                                  (index !== -1 &&
                                    items[index].amount !== 0 &&
                                    items[index].qty !== 0)
                                ) {
                                  await addNewItem(true, false);
                                }
                                await selectProduct(
                                  option,
                                  items.length - 1,
                                  false
                                );
                                option.qty = 1;
                                option.productIndex = index;
                              }}
                            >
                              Add{' '}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Grid>
                  </>
                ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <Button variant="contained" onClick={() => handleCloseProductDetails()}>
          CLOSE
        </Button> */}
          <Button
            variant="contained"
            className={classes.filterBtn}
            onClick={() => saveProductDetails()}
          >
            DONE
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openErrorAlertProduct}
        onClose={handleErrorAlertProductClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div
              dangerouslySetInnerHTML={{ __html: errorAlertProductMessage }}
            ></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertProductClose}
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

export default SaleQuotationProductDetails;