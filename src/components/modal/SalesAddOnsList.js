import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  Checkbox,
  Radio,
  RadioGroup,
  IconButton,
  FormControl,
  TextField,
  Typography,
  Paper,
  DialogContentText
} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

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
  w_30: {
    width: '30%',
    display: 'inline-flex',
    marginRight: '10px'
  },
  mb_20: {
    marginBottom: '20px'
  },
  numberMessage: {
    width: '100%',
    fontSize: '11px',
    marginBottom: '10px'
  },
  addOnstyle: {
    backgroundColor: '#EF5350',
    color: 'white',
    fontWeight: 'bold',
    width: '100px',
    marginTop: '10px',
    marginBottom: '10px'
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

const NumberRangeMessage = ({ minValue, maxValue }) => {
  const classes = useStyles();
  let message;

  if (minValue === maxValue) {
    if (minValue == 1) {
      message = 'Choose any one option.';
    } else {
      message = `Choose any ${minValue} option.`;
    }
  } else {
    message = `Choose maximum of ${maxValue}.`;
  }

  return <div className={classes.numberMessage}>{message}</div>;
};

const SalesAddOnsList = (props) => {
  const classes = useStyles();
  const min = 1;
  const max = 1;
  const store = useStore();
  const { openAddonList, productAddOnsData, addonIndex, selectedProductData } =
    toJS(store.SalesAddStore);
  const { handleAddOnsListModalClose, pushAddonProperties } =
    store.SalesAddStore;
  // const { handleAddOnsModalClose, updateState, saveData, updateData } =
  //   store.AddOnsStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [sumOfPrices, setSumOfPrices] = React.useState('');
  const [choosenAddOnsList, setChoosenAddOnsList] = React.useState([]);
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    outputFormat();
  }, [selectedValues]);

  useEffect(() => {
    const a = selectedProductData.addOnProperties;
    if (a.length > 0) {
      editFormat(a);
    }
  }, []);

  const handleRadioChange = (index, groupId, option) => {
    const co = option.additional_property_list[index];
    setSelectedValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [groupId]: [co]
      };
      return newValues;
    });
    outputFormat();
  };

  const handleCheckboxChange = (childoption, groupId) => {
    setSelectedValues((prevValues) => {
      const updatedGroupArray = (prevValues[groupId] || []).slice();

      const existingIndex = updatedGroupArray.findIndex(
        (item) => item.additionalPropertyId === childoption.additionalPropertyId
      );

      if (existingIndex !== -1) {
        updatedGroupArray.splice(existingIndex, 1);
      } else {
        updatedGroupArray.push(childoption);
      }

      return {
        ...prevValues,
        [groupId]: updatedGroupArray
      };
    });
    outputFormat();
  };

  const outputFormat = () => {
    const outputArray = Object.values(selectedValues).flat();
    let sumOfPrice = 0;
    for (let addOn of outputArray) {
      let tax = (parseFloat(addOn.cgst) || 0) + (parseFloat(addOn.sgst) || 0);
      let igst_tax = parseFloat(addOn.igst || 0);
      const taxIncluded = addOn.tax_included;
      let discountAmount = 0;

      let itemPrice = addOn.price;
      let totalGST = 0;
      let totalIGST = 0;
      let mrp_before_tax = 0;

      if (taxIncluded) {
        totalGST = itemPrice - itemPrice * (100 / (100 + tax));
        totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
      }

      mrp_before_tax = itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

      let totalItemPriceBeforeTax = parseFloat(mrp_before_tax);
      let itemPriceAfterDiscount = 0;

      const discountType = addOn.discount_type;
      if (discountType === 'percentage') {
        let percentage = addOn.discount_percent || 0;

        discountAmount = parseFloat(
          (totalItemPriceBeforeTax * percentage) / 100 || 0
        ).toFixed(2);

        addOn.discount_amount_per_item = parseFloat(discountAmount);
      } else if (discountType === 'amount') {
        discountAmount = addOn.discount_amount_per_item || 0;
        addOn.discount_percent =
          Math.round(
            ((discountAmount / totalItemPriceBeforeTax) * 100 || 0) * 100
          ) / 100;
      }

      addOn.discount_amount = parseFloat(discountAmount);

      // price before tax
      addOn.amount_before_tax = parseFloat(mrp_before_tax);

      let discountAmountPerProduct = parseFloat(discountAmount);

      //per item dicount is removed from per item

      itemPriceAfterDiscount = mrp_before_tax - discountAmountPerProduct;

      if (discountAmountPerProduct === 0) {
        addOn.cgst_amount = totalGST / 2;
        addOn.sgst_amount = totalGST / 2;
        addOn.igst_amount = totalIGST;
      }

      if (!taxIncluded) {
        const totalGST = (itemPriceAfterDiscount * tax) / 100;
        addOn.cgst_amount = totalGST / 2;
        addOn.sgst_amount = totalGST / 2;
        addOn.igst_amount = (itemPriceAfterDiscount * igst_tax) / 100;
      } else {
        let totalGST = 0;
        let amount = 0;

        if (discountAmount > 0) {
          totalGST = itemPriceAfterDiscount * (tax / 100);
          addOn.cgst_amount = totalGST / 2;
          addOn.sgst_amount = totalGST / 2;

          amount = itemPriceAfterDiscount * (igst_tax / 100);

          addOn.igst_amount = Math.round(amount * 100) / 100;
        }
      }

      const finalAmount = parseFloat(
        mrp_before_tax -
          addOn.discount_amount +
          addOn.cgst_amount +
          addOn.sgst_amount +
          addOn.igst_amount
      );

      addOn.amount = finalAmount;

      sumOfPrice += addOn.amount;
    }
    const total =
      (Number(sumOfPrice) * parseFloat(selectedProductData.qty)) +
      Number(selectedProductData.amount);
    setSumOfPrices(total);
    pushAddonProperties(outputArray, total);
  };

  const editFormat = (childJson) => {
    console.log('productAddOnsData', productAddOnsData);
    console.log('productAddOnsData1', childJson);
    const resultDict = {};
    if (productAddOnsData && productAddOnsData.length > 0) {
      productAddOnsData[addonIndex].forEach((parentItem) => {
        const groupId = parentItem.groupId;
        const additional_property_list = parentItem.additional_property_list;
        const filteredChild = childJson.filter((childItem) =>
          additional_property_list.some(
            (property) =>
              property.additionalPropertyId === childItem.additionalPropertyId
          )
        );
        resultDict[groupId] = filteredChild;
      });
      setSelectedValues(resultDict);
      outputFormat();
    }
  };

  const save = () => {
    handleAddOnsListModalClose();
  };

  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'xs'}
        open={openAddonList}
        onClose={handleAddOnsListModalClose}
      >
        <DialogTitle
          id="product-modal-title"
          style={{ boxShadow: '0 3px 9px -8px #000' }}
        >
          {/* {isEdit ? 'Edit Group' : 'Add Group'} */}
          <div style={{ fontSize: '18px' }}>
            {selectedProductData.item_name}{' '}
          </div>
          <div style={{ fontSize: '18px' }}>{selectedProductData.amount}</div>
          <IconButton
            aria-label="close"
            onClick={handleAddOnsListModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            {productAddOnsData[addonIndex] &&
            productAddOnsData[addonIndex].length > 0 ? (
              productAddOnsData[addonIndex].map((option, index) => (
                <Grid
                  item
                  xs={12}
                  style={{
                    marginBottom: '10px',
                    borderBottom: '1px solid #80808073'
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h5" style={{ marginBottom: '10px' }}>
                      {option.name}
                    </Typography>
                    <NumberRangeMessage
                      minValue={option.min_choices}
                      maxValue={option.max_choices}
                    />
                    <div></div>
                  </Grid>

                  <div>
                    <Grid
                      className={classes.addOnlist}
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {option.min_choices === 1 && option.max_choices === 1 ? (
                        <RadioGroup
                          aria-label="options"
                          name="options"
                          value={
                            selectedValues[option.groupId]?.additionalPropertyId
                          }
                          onChange={(event) =>
                            handleRadioChange(
                              event.target.value,
                              option.groupId,
                              option
                            )
                          }
                        >
                          {option.additional_property_list.map(
                            (childoption, index) => (
                              <FormControlLabel
                                key={childoption.additionalPropertyId}
                                value={index}
                                control={
                                  <Radio
                                    checked={
                                      selectedValues[option.groupId] &&
                                      selectedValues[option.groupId].findIndex(
                                        (item) =>
                                          item.additionalPropertyId ===
                                          childoption.additionalPropertyId
                                      ) !== -1
                                    }
                                  />
                                }
                                label={
                                  <Grid
                                    key={childoption.additionalPropertyId}
                                    className={classes.addOnlist}
                                    container
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography style={{ fontSize: '13px' }}>
                                      {childoption.name} : {childoption.price}
                                    </Typography>
                                  </Grid>
                                }
                              />
                            )
                          )}
                        </RadioGroup>
                      ) : (
                        option.additional_property_list &&
                        option.additional_property_list.map(
                          (childoption, index) => (
                            <Grid
                              className={classes.addOnlist}
                              container
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      selectedValues[option.groupId] &&
                                      selectedValues[option.groupId].findIndex(
                                        (item) =>
                                          item.additionalPropertyId ===
                                          childoption.additionalPropertyId
                                      ) !== -1
                                    }
                                    onChange={(e) => {
                                      handleCheckboxChange(
                                        childoption,
                                        option.groupId
                                      );
                                    }}
                                  />
                                }
                                label={
                                  <Typography style={{ fontSize: '13px' }}>
                                    {childoption.name} : {childoption.price}
                                  </Typography>
                                }
                              />
                            </Grid>
                          )
                        )
                      )}
                    </Grid>
                  </div>
                </Grid>
              ))
            ) : (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  style={{
                    width: '100%',
                    paddingLeft: '5px',
                    textAlign: 'center'
                  }}
                ></div>
              </div>
            )}
          </Grid>
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: 'space-between',
            backgroundColor: '#f44336',
            color: '#fff'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>Item Total : {sumOfPrices}</div>
          {/* <Button
            color="secondary"
            style={{ color: '#fff' }}
            variant="outlined"
            onClick={save}
          >
            APPLY
          </Button> */}
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorMesssageDialog}
        onClose={handleErrorAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMesssage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(SalesAddOnsList);