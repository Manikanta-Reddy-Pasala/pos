import React from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
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

const AddRate = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { rate, rateDialogOpen, isEdit } = toJS(store.RateStore);
  const {
    handleRateModalClose,
    setMetal,
    setPurity,
    setRateByGram,
    saveData,
    updateData,
    setDefaultBool
  } = store.RateStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [maxWidth] = React.useState('sm');

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={rateDialogOpen}
        onClose={handleRateModalClose}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          {isEdit ? 'Edit Rate' : 'Add Rate'}
          <IconButton
            aria-label="close"
            onClick={handleRateModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">Metal </Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Metal name"
                  value={rate.metal}
                  onChange={(event) => setMetal(event.target.value.toString())}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Purity</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Purity"
                  value={rate.purity}
                  onChange={(event) => {
                    setPurity(event.target.value);
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Rate/g</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Rate"
                  value={rate.rateByGram}
                  onFocus={(e) =>
                    rate.rateByGram === 0 ? setRateByGram(e.target.value) : ''
                  }
                  onChange={(event) => {
                    setRateByGram(event.target.value);
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rate.defaultBool}
                    onChange={(e) => {
                      setDefaultBool(e.target.checked);
                    }}
                    name="defaultBox"
                  />
                }
                label="Mark Default"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              if (isEdit) {
                updateData();
              } else {
                saveData();
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(AddRate);
