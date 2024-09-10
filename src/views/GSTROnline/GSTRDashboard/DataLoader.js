import React, { useState} from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  withStyles,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import useWindowDimensions from '../../../components/windowDimension';





const DataLoader = (props) => {
  const stores = useStore();
  const [loader, setLoader] = useState(true);
  const [loaderMsg, setLoaderMsg] = useState('');
  // const [taxData, setTaxData] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const { setFiled } = stores.GSTR1Store;


  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={loader}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{loaderMsg}</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default injectWithObserver(DataLoader);
