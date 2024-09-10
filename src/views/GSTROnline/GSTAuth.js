import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  withStyles,
  Typography,
  FormControl,
  TextField,
  Button,
  Dialog,
  DialogContent,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { useTheme } from '@material-ui/core/styles';
import useWindowDimensions from '../../components/windowDimension';
import { toJS } from 'mobx';
import { getSelectedDateMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';
import {
  generateOTP,
  validateOTP
} from 'src/components/Helpers/GstrOnlineHelper';
import GSTError from 'src/views/GSTROnline/GSTError';
import DialogContentText from '@material-ui/core/DialogContentText';
import Loader from 'react-js-loader';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },

  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  listli: {
    borderBottom: '1px solid #c5c4c4',
    paddingBottom: 10,
    marginBottom: 12,
    background: 'none'
  },
  listHeaderBox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 0px 30px'
  },
  listbox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 30px 30px',

    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    }
  },
  activeClass: {
    backgroundColor: '#2977f5',
    color: 'white'
  },
  content: {
    cursor: 'pointer'
  },
  w_30: {
    width: '30%',
    display: 'inline-flex'
  },
  step1: {
    width: '78%',
    margin: 'auto',
    backgroundColor: 'white',
    marginBottom: '2%'
  },
  step2: {
    width: '95%',
    margin: 'auto',
    // backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  fGroup: {
    width: '50%',
    margin: 'auto'
  },
  CenterStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'grey'
  },
  CenterStartEndWc: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: '#EF5350',
    color: 'white'
  },
  mb_20: {
    marginBottom: '20px'
  },
  mb_10: {
    marginBottom: '10px'
  },
  wAuto: {
    width: '80%',
    margin: 'auto',
    textAlign: 'center'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%',
    borderRadius: 1,
    paddingTop: 10,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white'
  },
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '99999',
    padding: '10px'
  },
  resendOTP:{
    color:'#f44336',
    textAlign:'right',
    cursor:'pointer',
    fontSize: '13px',
    fontWeight: 'bold'
  }
}));
const GSTAuth = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { height } = useWindowDimensions();
  const { updateGSTAuth, handleErrorAlertOpen, setLoginStep } =
    stores.GSTR1Store;
  const { openErrorMesssageDialog, loginStep,taxData,setTaxData } = toJS(stores.GSTR1Store);
  

  const { GSTRDateRange } = toJS(stores.GSTR2AStore);
  const { GSTR2BDateRange } = toJS(stores.GSTR2BStore);
  const { GSTR3BDateRange } = toJS(stores.GSTR3BStore);

  useEffect(() => {
    fetchData();
  }, []);

  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  const fetchData = async () => {
    
    
    console.log("taxData",taxData);
    if (taxData.gstPortalUserName !== ''  && taxData.gstPortalUserName != null) {
      setUsername(taxData.gstPortalUserName);
      generateOTPForGSTN();
    }
  };

  const generateOTPForGSTN = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: taxData.gstin,
      username:
        taxData.gstPortalUserName != '' && taxData.gstPortalUserName != null ? taxData.gstPortalUserName : username
    };
    const apiResponse = await generateOTP(reqData);
    if (apiResponse.code == 200) {
      if (apiResponse && apiResponse.status === 1) {
        setLoginStep(2);
      } else {
        errorMessageCall(apiResponse.message);
      }
    } else {
      errorMessageCall(apiResponse.message);
    }
    setLoader(false);
  };

  const validateOTPforGSTN = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: taxData.gstin,
      otp: otp
    };

    const apiResponse = await validateOTP(reqData);
    if (apiResponse.code == 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
      } else {
        errorMessageCall(apiResponse.message);
        updateGSTAuth(false);
      }
    } else {
      errorMessageCall(apiResponse.message);
    }
    setLoader(false);
  };

  return (
    <>
      <div className={classes.step1} style={{ height: height - 50 }}>
        <Typography style={{ padding: '10px' }} variant="h6">
          GSTIN : {taxData?.gstin}
        </Typography>
        <Typography style={{ padding: '10px' }} variant="h6">
          FP :{' '}
          {props.type === 'GSTR2A'
            ? getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)
            : props.type === 'GSTR2B'
            ? getSelectedDateMonthAndYearMMYYYY(GSTR2BDateRange.fromDate)
            : props.type === 'GSTRREPORT'
            ? ''
            : getSelectedDateMonthAndYearMMYYYY(GSTR3BDateRange.fromDate)}
        </Typography>
        {loginStep === 1 && (
          <div className={classes.fGroup}>
            <Grid container direction="row" alignItems="stretch">
              <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <FormControl style={{ marginBottom: '6%' }} fullWidth>
                  <Typography component="subtitle1">Username</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="GST Portal Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={generateOTPForGSTN}
                  style={{ width: '100%' }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </div>
        )}

        {loginStep === 2 && (
          <div className={classes.fGroup}>
            <Grid container direction="row" alignItems="stretch">
              <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <FormControl style={{ marginBottom: '6%' }} fullWidth>
                  <Typography component="subtitle1">OTP</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Typography onClick={generateOTPForGSTN} className={classes.resendOTP} component="subtitle1">Resend OTP</Typography>
                </FormControl>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={validateOTPforGSTN}
                  style={{ width: '100%' }}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
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
      {openErrorMesssageDialog && <GSTError />}
    </>
  );
};

export default injectWithObserver(GSTAuth);
