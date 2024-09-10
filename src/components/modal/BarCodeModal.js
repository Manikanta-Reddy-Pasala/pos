import React, { useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  Box,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  RadioGroup,
  Radio
} from '@material-ui/core';
import Controls from '../../components/controls/index';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

const Barcode = require('react-barcode');

const useStyles = makeStyles((theme) => ({}));
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

const barCodes = [];

const BarCodeModal = (props) => {
  const classes = useStyles();
  const stores = useStore();

  const [value, setValue] = React.useState('printall');
  const { barcodeDialogOpen } = toJS(stores.BarcodeStore);
  const { handleBarCodeModalClose } = stores.BarcodeStore;

  const handleBarcodeChange = (event) => {
    setValue(event.target.value);
  };

  const handleBarCodePrint = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.businessproduct.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    query
      .exec()
      .then(async (data) => {
        if (!data) {
          console.log('Internal Server Error');
          return;
        }
        let response = data.map((item) => item.toJSON());
        if (value === 'printall') {
          // barCodes = response.map((data) => data.barcode);
        } else {
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  return (
    <Dialog
      open={barcodeDialogOpen}
      fullWidth={true}
      maxWidth={'sm'}
      onClose={handleBarCodeModalClose}
    >
      <DialogTitle id="product-modal-title">
        Print Barcode
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleBarCodeModalClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="stretch"
          className={classes.marginTopFormGroup}
        >
          <Grid item sm={12} className="grid-padding">
            <FormControl className={classes.checkboxMarginTop}>
              <RadioGroup
                aria-label="barcode"
                name="barcodeprint"
                value={value}
                onChange={handleBarcodeChange}
              >
                <FormControlLabel
                  value="printall"
                  control={<Radio />}
                  label="Print All"
                />
                <FormControlLabel
                  value="numberofprint"
                  control={<Radio />}
                  label="How any to Print?"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Box></Box>
      </DialogContent>
      <DialogActions>
        <Controls.Button
          text="Cancel"
          size="small"
          variant="text"
          color="secondary"
          onClick={handleBarCodeModalClose}
        />
        <Controls.Button
          text="OK"
          size="small"
          variant="contained"
          color="secondary"
          onClick={handleBarCodePrint}
        />
        {barCodes.map((codes, index) => (
          <Barcode value={codes} />
        ))}
        {/* <Barcode value="http://github.com/kciter" /> */}
      </DialogActions>
    </Dialog>
  );
};

export default BarCodeModal;
