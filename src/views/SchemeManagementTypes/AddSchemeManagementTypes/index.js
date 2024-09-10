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

const AddSchemeManagementTypes = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { schemeTypes, schemeTypesDialogOpen, isEdit } = toJS(store.SchemeTypesStore);
  const { handleSchemeTypesModalClose, setName, saveData, updateData } =
    store.SchemeTypesStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
        fullWidth={true}
        maxWidth={'md'}
        open={schemeTypesDialogOpen}
        onClose={handleSchemeTypesModalClose}
      >
        <DialogTitle id="product-modal-title">
          {isEdit ? 'Edit Scheme Type' : 'Add Scheme Type'}
          <IconButton
            aria-label="close"
            onClick={handleSchemeTypesModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">Scheme Type Name</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Scheme Type Name"
                  value={schemeTypes.name}
                  onChange={(event) =>
                    setName(event.target.value.toString())
                  }
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
              if (schemeTypes.name === '') {
                setErrorMessage('Scheme Type name cannot be left blank');
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

export default InjectObserver(AddSchemeManagementTypes);