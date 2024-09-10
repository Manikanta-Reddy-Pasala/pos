import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  FormControlLabel,
  TextField,
  Checkbox,
  FormLabel
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import Typography from 'src/theme/typography';

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
  blockLine: {
    display: 'inline-block'
  },
  input: {
    width: '90%'
  },
  containerField: {
    marginTop: '16px'
  },
  formLabel: {
    paddingLeft: '30px',
    color: '#263238',
    fontWeight: 'bold'
  },
  checkBoxContainer: {
    paddingTop: '30px',
    paddingBottom: '30px'
  },
  flexOne: {
    flex: 1,
    height: '30px'
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

const CustomPreviewPrintPopUp = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { handleCloseCustomPreviewPrintPopUp } = store.PrinterSettingsStore;
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal, openCustomPreviewPrintPopUp } = toJS(
    store.PrinterSettingsStore
  );

  const [printOriginal, setPrintOriginal] = useState(true);
  const [printOriginalCopies, setPrintOriginalCopies] = useState(1);
  const [printDuplicate, setPrintDuplicate] = useState(false);
  const [printDuplicateCopies, setPrintDuplicateCopies] = useState(1);
  const [printTriplicate, setPrintTriplicate] = useState(false);
  const [printTriplicateCopies, setPrintTriplicateCopies] = useState(1);
  const [printCustom, setPrintCustom] = useState(false);
  const [printCustomName, setPrintCustomName] = useState('');
  const [printCustomCopies, setPrintCustomCopies] = useState(1);

  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('props', props);
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  useEffect(() => {
    if (
      invoiceRegular &&
      invoiceRegular !== null &&
      invoiceRegular.showCustomPrintPopUp === true
    ) {
      setPrintOriginal(invoiceRegular.printOriginal);
      setPrintOriginalCopies(invoiceRegular.printOriginalCopies);
      setPrintDuplicate(invoiceRegular.printDuplicate);
      setPrintDuplicateCopies(invoiceRegular.printDuplicateCopies);
      setPrintTriplicate(invoiceRegular.printTriplicate);
      setPrintTriplicateCopies(invoiceRegular.printTriplicateCopies);
      setPrintCustom(invoiceRegular.printCustom);
      setPrintCustomName(invoiceRegular.printCustomName);
      setPrintCustomCopies(invoiceRegular.printCustomCopies);
    }
  }, []);

  const saveDataOnClick = () => {
    const invoiceRegular = {
      printOriginal: printOriginal,
      printOriginalCopies: printOriginalCopies,
      printDuplicate: printDuplicate,
      printDuplicateCopies: printDuplicateCopies,
      printTriplicate: printTriplicate,
      printTriplicateCopies: printTriplicateCopies,
      printCustom: printCustom,
      printCustomName: printCustomName,
      printCustomCopies: printCustomCopies
    };

    props.sendDataToPrintPopup(invoiceRegular);

    handleCloseCustomPreviewPrintPopUp();
  };

  return (
    <div>
      <Dialog
        open={openCustomPreviewPrintPopUp}
        onClose={handleCloseCustomPreviewPrintPopUp}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          Print Options
          <IconButton
            aria-label="close"
            onClick={(e) => {
              handleCloseCustomPreviewPrintPopUp();
            }}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            {error === true && (
              <Typography>
                Please choose atleast one print option to proceed further
              </Typography>
            )}
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
                        checked={printOriginal}
                        onChange={(e) => {
                          setPrintOriginal(e.target.checked);
                        }}
                      />
                    }
                    label="Print Original"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={printDuplicate}
                        onChange={(e) => {
                          setPrintDuplicate(e.target.checked);
                        }}
                      />
                    }
                    label="Print Duplicate"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={printTriplicate}
                        onChange={(e) => {
                          setPrintTriplicate(e.target.checked);
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
                      value={printOriginalCopies}
                      onChange={(e) => setPrintOriginalCopies(e.target.value)}
                      disabled={!printOriginal}
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
                      value={printDuplicateCopies}
                      type="number"
                      disabled={!printDuplicate}
                      onChange={(e) => setPrintDuplicateCopies(e.target.value)}
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
                      value={printTriplicateCopies}
                      type="number"
                      disabled={!printTriplicate}
                      onChange={(e) => setPrintTriplicateCopies(e.target.value)}
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
                        checked={printCustom}
                        onChange={(e) => {
                          setPrintCustom(e.target.checked);
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
                      value={printCustomName}
                      onChange={(e) => setPrintCustomName(e.target.value)}
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
                    value={printCustomCopies}
                    disabled={!printCustom}
                    onChange={(e) => setPrintCustomCopies(e.target.value)}
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
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            disabled={false}
            onClick={() => {
              handleCloseCustomPreviewPrintPopUp();
            }}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            disabled={false}
            onClick={() => {
              saveDataOnClick();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(CustomPreviewPrintPopUp);
