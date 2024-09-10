import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Grid,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
  FormControl
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import * as countryHelper from 'src/components/Utility/CountriesUtility';
import * as currencyHelper from 'src/components/Utility/CurrencyUtility';

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
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: '400px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0),
    color: theme.palette.grey[500]
  }
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => onClose()}
        >
          <CancelRoundedIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const MfgDetails = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { fullWidth, maxWidth } = props;

  const { saleDetails, openMfgDetails } = toJS(stores.SalesAddStore);
  const {
    handleCloseMfgDetails,
    setExportType,
    setExportCountry,
    setExportCurrency,
    setExportConversionRate,
    setExportShippingBillNo,
    exportShippingBillDate,
    setExportShippingPortNo
  } = stores.SalesAddStore;

  const [countriesList] = useState(countryHelper.getCountriesList());
  const [currenciesList] = useState(currencyHelper.getCurrenciesList());

  const saveTransportDetails = async () => {
    handleCloseMfgDetails();
  };

  const exportTypes = [
    'Export under bond/LUT',
    'Export with IGST',
    'SEZ with IGST payment',
    'SEZ without IGST payment',
    'A deemed export'
  ];

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'md'}
      open={openMfgDetails}
      onClose={() => handleCloseMfgDetails()}
    >
      <DialogTitle
        id="responsive-dialog-title"
        onClose={() => handleCloseMfgDetails()}
      >
        Export Details
      </DialogTitle>

      <DialogContent>
        <Grid container direction="row" alignItems="stretch">
          <Grid container className={classes.gridRow} spacing={2}>
            <Grid item xs={6}>
              <Typography component="subtitle1">Export Type</Typography>
              <Select
                displayEmpty
                value={saleDetails.exportType}
                input={<OutlinedInput style={{ width: '100%' }} />}
                onChange={(e) => {
                  setExportType(e.target.value);
                }}
              >
                {exportTypes.map((option, index) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={6}>
              <Typography component="subtitle1">Country of Supply</Typography>
              <Select
                displayEmpty
                value={saleDetails.exportCountry}
                input={<OutlinedInput style={{ width: '100%' }} />}
                onChange={(e) => {
                  setExportCountry(e.target.value);
                }}
              >
                {countriesList.map((option, index) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={6}>
              <Typography component="subtitle1">Currency</Typography>
              <Select
                displayEmpty
                value={saleDetails.exportCurrency}
                input={<OutlinedInput style={{ width: '100%' }} />}
                onChange={(e) => {
                  setExportCurrency(e.target.value);
                }}
              >
                {countriesList.map((option, index) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid
              item
              xs={6}
              className="grid-padding"
            >
              <FormControl fullWidth>
                <Typography component="subtitle1">Conversion Rate</Typography>
                <TextField
                  variant={'standard'}
                  margin="dense"
                  value={saleDetails.exportConversionRate}
                  onChange={(event) =>
                    setExportConversionRate(event.target.value)
                  }
                />
              </FormControl>
            </Grid>

            <Grid
              item
              xs={6}
              className="grid-padding"
            >
              <FormControl fullWidth>
                <Typography component="subtitle1">Shipping Bill No</Typography>
                <TextField
                  variant={'standard'}
                  margin="dense"
                  value={saleDetails.setExportShippingBillNo}
                  onChange={(event) =>
                    setExportShippingBillNo(event.target.value)
                  }
                />
              </FormControl>
            </Grid>

            <Grid
              item
              xs={6}
              className="grid-padding"
            >
              <FormControl fullWidth>
                <Typography component="subtitle1">
                  Shipping Port Code
                </Typography>
                <TextField
                  variant={'standard'}
                  margin="dense"
                  value={saleDetails.exportShippingPortCode}
                  onChange={(event) =>
                    setExportShippingPortNo(event.target.value)
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => saveTransportDetails()}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MfgDetails;