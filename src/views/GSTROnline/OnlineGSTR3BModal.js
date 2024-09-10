import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  withStyles,
  IconButton,
  Typography,
  FormControl,
  TextField,
  Button
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import styled, { css } from 'styled-components';
import axios from 'axios';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Gstr31EditReport from '../../views/Reports/TaxReport/GSTR3B/edit3.1';
import Gstr32EditReport from '../../views/Reports/TaxReport/GSTR3B/edit3.2';
import Gstr4EditReport from '../../views/Reports/TaxReport/GSTR3B/edit4';
import Gstr5EditReport from '../../views/Reports/TaxReport/GSTR3B/edit5';
import Gstr51EditReport from '../../views/Reports/TaxReport/GSTR3B/edit5.1';


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
    width: '65%',
    margin: 'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  step2: {
    width: '95%',
    margin: 'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  fGroup: {
    width: '50%',
    margin: 'auto',
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
  pointer: {
    cursor:'pointer'
  },
  mb_10: {
    marginBottom: '10px'
  },
  wAuto: {
    width: '80%',
    margin: 'auto',
    textAlign: 'center'
  },
  dHead: {
    height: '100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#14375d',
    color: '#fff'
  }
}));
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


const gray = '#8080804d';
const darkgray = '#808080bf';
const blue = '#FF6666';
const white = '#DBF1FF';

const ProgressBar = styled.ol`
  margin: 0 auto;
  padding: 0em 0 2em;
  list-style: none;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const ProgressBarStep = styled.li`
  text-align: center;
  position: relative;
  width: 100%;

  &:before,
  &:after {
    content: "";
    height: 0.3em;
    background-color: ${gray};
    position: absolute;
    z-index: 1;
    width: 100%;
    left: -50%;
    top: 43%;
    transform: translateY(-50%);
    transition: all 1.0s ease-out;
  }

  &:first-child:before,
  &:first-child:after {
    display: none;
  }

  &:after {
    background-color: ${blue};
    width: 0%;
  }

  &.is-complete + &.is-current:after,
  &.is-complete + &.is-complete:after {
    width: 100%;
  }
`;

const ProgressBarIcon = styled.svg`
  width: 1.5em;
  height: 1.5em;
  background-color: ${darkgray};
  fill: ${darkgray};
  border-radius: 50%;
  padding: 0.5em;
  max-width: 100%;
  z-index: 10;
  position: relative;
  transition: all 1.75s ease-out;

  ${ProgressBarStep}.is-current & {
    fill: ${blue};
    background-color: ${blue};
  }

  ${ProgressBarStep}.is-complete & {
    fill: ${white};
    background-color: ${blue};
  }

  .is-complete & {
    fill: ${white};
    background-color: ${blue};
  }
`;

const ProgressBarStepLabel = styled.span`
  display: block;
  font-weight:bold;
  text-transform: uppercase;
  color: ${gray};
  position: absolute;
  padding-top: 0.5em;
  width: 100%;
  font-size: 12px;
  transition: all 1.0s ease-out;

  ${ProgressBarStep}.is-current > &,
  ${ProgressBarStep}.is-complete > & {
    color: ${blue};
  }
`;


const OnlineGSTR3BModal = (props) => {
  const myRef = useRef(null);
  const classes = useStyles();
  const stores = useStore();
  const [active, setActive] = useState(0);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [pan, setPAN] = useState('');
  const [evcotp, setEvcOtp] = useState('');
  const [loginStep, setLoginStep] = useState(1);
  const [finalStep, setFinalStep] = useState(1);
  // const [step, setStep] = useState(1);
  const [confirmSummary, setConfirmSummary] = useState(false);
  const inputRef = useRef([]);
  const [moreVisibility, setMoreVisibility] = useState({});
  const [downloadData, setDownloadData] = useState({});
  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const [refId, setRefId] = useState('');
  // const [isEdit3B, setIsEdit] = useState(false);
  const [editSec, setEditSec] = useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const API_SERVER = window.REACT_APP_API_SERVER;


  const { handleOnlineGSTR3BModalClose,handleEditGSTR3B,handleCloseEditGSTR3B, onlineGSTR3BDialogOpen,isEdit3B,edit3BSection } = stores.GSTR3BStore;

  useEffect(() => {

  }, []);

  




  return (
    <>
      <Dialog
        open={onlineGSTR3BDialogOpen}
        fullScreen
        onClose={handleOnlineGSTR3BModalClose}
      >
        <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
          GST Portal
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleOnlineGSTR3BModalClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
        <Typography className={`${classes.mb_10}`} style={{ padding: '10px' }} variant="h3">GSTR-3B - Monthly Return</Typography>
          <div className={classes.step2}>
          {!isEdit3B ? (<div>
              <Grid container direction="row" alignItems="stretch">
                <Grid item xs={4} className={`grid-padding ${classes.mb_20} ${classes.pointer}`} onClick={() => handleEditGSTR3B('31')}>
                  <div className={classes.dHead}>
                    <Typography style={{ padding: '10px' }} variant="h4">
                      3.1 Tax on outward and reverse charge inward supplies
                    </Typography>
                  </div>
                  <Grid container direction="row" alignItems="stretch" style={{ backgroundColor: '#fff',minHeight:'139px' }}>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Integrated Tax <br /> 0.00
                      </Typography>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        State/UT Tax <br /> 0.00
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Central Tax <br /> 0.00
                      </Typography>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        CESS <br /> 0.00
                      </Typography>
                    </Grid>
                  </Grid>

                </Grid>
                <Grid item xs={4} className={`grid-padding ${classes.mb_20} ${classes.pointer}`} onClick={() => handleEditGSTR3B('32')}>
                  <div className={classes.dHead}>
                    <Typography style={{ padding: '10px' }} variant="h4">
                      3.2 Inter-state supplies
                    </Typography>
                  </div>
                  <Grid container direction="row" alignItems="stretch" style={{ backgroundColor: '#fff',minHeight:'139px' }}>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Taxable Value <br /> 0.00
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Integrated Tax <br /> 0.00
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4} className={`grid-padding ${classes.mb_20} ${classes.pointer}`} onClick={() => handleEditGSTR3B('4')}>
                  <div className={classes.dHead}>
                    <Typography style={{ padding: '10px' }} variant="h4">
                      4. Eligible ITC
                    </Typography>
                  </div>
                  <Grid container direction="row" alignItems="stretch" style={{ backgroundColor: '#fff',minHeight:'139px' }}>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Integrated Tax <br /> 0.00
                      </Typography>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        State/UT Tax <br /> 0.00
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Central Tax <br /> 0.00
                      </Typography>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        CESS <br /> 0.00
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4} className={`grid-padding ${classes.mb_20} ${classes.pointer}`} onClick={() => handleEditGSTR3B('5')}>
                  <div className={classes.dHead}>
                    <Typography style={{ padding: '10px' }} variant="h4">
                      5. Excempt, nil and Non GST inward supplies
                    </Typography>
                  </div>
                  <Grid container direction="row" alignItems="stretch" style={{ backgroundColor: '#fff',minHeight:'139px' }}>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Inter-state supplies <br /> 0.00
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Intra-state supplies <br /> 0.00
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4} className={`grid-padding ${classes.mb_20} ${classes.pointer}`} onClick={() => handleEditGSTR3B('51')}>
                  <div className={classes.dHead}>
                    <Typography style={{ padding: '10px' }} variant="h4">
                      5.1 Interest and Late fee
                    </Typography>
                  </div>
                  <Grid container direction="row" alignItems="stretch" style={{ backgroundColor: '#fff',minHeight:'139px' }}>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Integrated Tax <br /> 0.00
                      </Typography>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        State/UT Tax <br /> 0.00
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className={`grid-padding ${classes.mb_10}`}>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        Central Tax <br /> 0.00
                      </Typography>
                      <Typography style={{ padding: '10px' }} variant="h6">
                        CESS <br /> 0.00
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>):(
            <div>
              {edit3BSection == '31' && <Gstr31EditReport/>}
              {edit3BSection == '32' && <Gstr32EditReport/>}
              {edit3BSection == '4' && <Gstr4EditReport/>}
              {edit3BSection == '5' && <Gstr5EditReport/>}
              {edit3BSection == '51' && <Gstr51EditReport/>}
            </div>)}
          </div>

          


        </DialogContent>
      </Dialog>
    </>
  );
};

export default injectWithObserver(OnlineGSTR3BModal);
