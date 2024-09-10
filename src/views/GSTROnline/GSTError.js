import React from 'react';
import {
  Dialog,
  Button,
  DialogContent,
  DialogContentText,
  withStyles
} from '@material-ui/core';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';


const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);


const GSTError = (props) => {
  const stores = useStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    errorMessage,
    openErrorMesssageDialog 
  } = toJS(stores.GSTR1Store);
  
  const { handleErrorAlertClose } =
    stores.GSTR1Store;
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorMesssageDialog}
        onClose={handleErrorAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default injectWithObserver(GSTError);