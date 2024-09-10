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
  DialogContentText
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

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

const AddTDS = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { tds, tdsDialogOpen, isEdit } = toJS(store.TDSStore);
  const {
    handleTDSModalClose,
    setTDSName,
    setTDSRate,
    saveData,
    updateData,
    setTDSCode
  } = store.TDSStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [maxWidth] = React.useState('sm');
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);

  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={tdsDialogOpen}
        onClose={handleTDSModalClose}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          {isEdit ? 'Edit TDS' : 'Add TDS'}
          <IconButton
            aria-label="close"
            onClick={handleTDSModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">TDS Code</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter TDS Code"
                  value={tds.code}
                  onChange={(event) =>
                    setTDSCode(event.target.value.toString())
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">TDS Name</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter TDS Name"
                  value={tds.name}
                  onChange={(event) =>
                    setTDSName(event.target.value.toString())
                  }
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
                <Typography variant="subtitle1">TDS Rate(%)</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  placeholder="Enter TDS Rate"
                  value={tds.rate}
                  onFocus={(e) => (tds.rate === 0 ? setTDSRate('') : '')}
                  onChange={(event) => {
                    setTDSRate(event.target.value);
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              if (tds.name === '') {
                setErrorMessage('TDS name cannot be left blank');
                setOpenErrorMesssageDialog(true);
              } else if (tds.rate === '' || tds.rate === 0) {
                setErrorMessage('Please provide a valid TDS rate');
                setOpenErrorMesssageDialog(true);
              } else {
                if (isEdit) {
                  updateData();
                } else {
                  saveData();
                }
              }
            }}
          >
            Save
          </Button>
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

export default InjectObserver(AddTDS);