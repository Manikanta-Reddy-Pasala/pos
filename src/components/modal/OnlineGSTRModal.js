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
import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon  from '@material-ui/icons/KeyboardArrowDown';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


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
  step1:{
    width:'65%',
    margin:'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  step2:{
    width:'95%',
    margin:'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  fGroup:{
    width:'50%',
    margin:'auto',
  },
  CenterStartEnd:{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor:'grey'
  },
  CenterStartEndWc:{
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
  mb_20:{
    marginBottom:'20px'
  },
  mb_10:{
    marginBottom:'10px'
  },
  wAuto:{
    width:'80%',
    margin:'auto',
    textAlign:'center'
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


const OnlineGSTRModal = (props) => {
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const API_SERVER = window.REACT_APP_API_SERVER;
  const resp=JSON.parse(props.jsonData);
  
  let downloadResp = {};

  const b2b = resp.b2b;
  const b2cl = resp.b2cl;
  const cdnr = resp.cdnr;
  const b2cs = resp.b2cs;
  const cdnur = resp.cdnur;
  const hsn = resp.hsn;
  const doc = resp.doc_issue;

  const downloadJSON= {
    "status": 1,
    "api_call": "gstr1-retsum",
    "message": {
        "data": {
            "gstin": "29AACCO6446R1ZL",
            "ret_period": "012024",
            "chksum": "5d72b360c55e85017633b0fd949c4a637b4e080efb89573568809c89ad8b0ec0",
            "newSumFlag": true,
            "sec_sum": [
                {
                    "sec_nm": "AT",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "ATA",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2B",
                    "chksum": "ab27347d59d11a42e9fc9a0359bececda93fd9575173c55f30b711cb3d7614fb",
                    "ttl_rec": 7,
                    "ttl_tax": "57749.49",
                    "ttl_igst": "0",
                    "ttl_sgst": "5197.46",
                    "ttl_cgst": "5197.46",
                    "ttl_val": "68144.41",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2BA",
                    "chksum": "063a5b1a3bbc23d11761b156c446a285d7703be484a276a0a32e29bda10d4f8a",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2BA_4A",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2BA_4B",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2BA_6C",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2BA_SEZWOP",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2BA_SEZWP",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2B_4A",
                    "chksum": "75057268bf29f3cb49d6e3fb93a7770032c61d78ceca2fe27ff82d42c0c3ae09",
                    "ttl_rec": 7,
                    "ttl_tax": "57749.49",
                    "ttl_igst": "0",
                    "ttl_sgst": "5197.46",
                    "ttl_cgst": "5197.46",
                    "ttl_val": "68144.41",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2B_4B",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2B_6C",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2B_SEZWOP",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2B_SEZWP",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2CL",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2CLA",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "B2CS",
                    "chksum": "dfc47b0dcdd917df52439bd71df7516104f08c2e57d4c269a1534b70d9a1ddcc",
                    "ttl_rec": 1,
                    "ttl_tax": "4237.28",
                    "ttl_igst": "0",
                    "ttl_sgst": "381.36",
                    "ttl_cgst": "381.36",
                    "ttl_val": "5000",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "B2CSA",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "ECOM",
                    "chksum": "063a5b1a3bbc23d11761b156c446a285d7703be484a276a0a32e29bda10d4f8a",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "ECOM_DE",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "ECOM_REG",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "ECOM_SEZWOP",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "ECOM_SEZWP",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "ECOM_UNREG",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "HSN",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "NIL",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_expt_amt": "0",
                    "ttl_ngsup_amt": "0",
                    "ttl_nilsup_amt": "0"
                },
                {
                    "sec_nm": "TTL_LIAB",
                    "chksum": "5d72b360c55e85017633b0fd949c4a637b4e080efb89573568809c89ad8b0ec0",
                    "ttl_rec": 9,
                    "ttl_tax": "61986.77",
                    "ttl_igst": "0",
                    "ttl_sgst": "5578.82",
                    "ttl_cgst": "5578.82",
                    "ttl_val": "73144.41",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "TXPD",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0"
                },
                {
                    "sec_nm": "TXPDA",
                    "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0"
                },
                {
                    "sec_nm": "DOC_ISSUE",
                    "chksum": "f21581461a78806b3c0673c7a41eaafa84521cd4b81b7c7e2bf37d88b7a70584",
                    "ttl_rec": 1,
                    "ttl_doc_issued": 8,
                    "ttl_doc_cancelled": 0,
                    "net_doc_issued": 8
                },
                {
                    "sec_nm": "CDNR",
                    "chksum": "063a5b1a3bbc23d11761b156c446a285d7703be484a276a0a32e29bda10d4f8a",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "sub_sections": [
                        {
                            "sec_nm": "CDNR_4A",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "sec_nm": "CDNR_4B",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "sec_nm": "CDNR_6C",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "sec_nm": "CDNR_SEZWOP",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "sec_nm": "CDNR_SEZWP",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        }
                    ]
                },
                {
                    "sec_nm": "CDNRA",
                    "chksum": "063a5b1a3bbc23d11761b156c446a285d7703be484a276a0a32e29bda10d4f8a",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0",
                    "sub_sections": [
                        {
                            "sec_nm": "CDNRA_4A",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        },
                        {
                            "sec_nm": "CDNRA_4B",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        },
                        {
                            "sec_nm": "CDNRA_6C",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        },
                        {
                            "sec_nm": "CDNRA_SEZWOP",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        },
                        {
                            "sec_nm": "CDNRA_SEZWP",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        }
                    ]
                },
                {
                    "sec_nm": "CDNUR",
                    "chksum": "74313561d1897af3dc03f4fae174960d28968f92b49230523faca462b848db60",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "sub_sections": [
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "B2CL",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWOP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        }
                    ]
                },
                {
                    "sec_nm": "CDNURA",
                    "chksum": "74313561d1897af3dc03f4fae174960d28968f92b49230523faca462b848db60",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0",
                    "sub_sections": [
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "B2CL",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        },
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWOP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        },
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        }
                    ]
                },
                {
                    "sec_nm": "EXP",
                    "chksum": "3b7546ed79e3e5a7907381b093c5a182cbf364c5dd0443dfa956c8cca271cc33",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "sub_sections": [
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWOP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        }
                    ]
                },
                {
                    "sec_nm": "EXPA",
                    "chksum": "3b7546ed79e3e5a7907381b093c5a182cbf364c5dd0443dfa956c8cca271cc33",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "act_tax": "0",
                    "act_igst": "0",
                    "act_sgst": "0",
                    "act_cgst": "0",
                    "act_val": "0",
                    "act_cess": "0",
                    "sub_sections": [
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWOP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        },
                        {
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "typ": "EXPWP",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0",
                            "act_tax": "0",
                            "act_igst": "0",
                            "act_sgst": "0",
                            "act_cgst": "0",
                            "act_val": "0",
                            "act_cess": "0"
                        }
                    ]
                },
                {
                    "sec_nm": "SUPECOM",
                    "chksum": "3b7546ed79e3e5a7907381b093c5a182cbf364c5dd0443dfa956c8cca271cc33",
                    "ttl_rec": 0,
                    "ttl_tax": "0",
                    "ttl_igst": "0",
                    "ttl_sgst": "0",
                    "ttl_cgst": "0",
                    "ttl_val": "0",
                    "ttl_cess": "0",
                    "sub_sections": [
                        {
                            "sec_nm": "SUPECOM_14A",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        },
                        {
                            "sec_nm": "SUPECOM_14B",
                            "chksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            "ttl_rec": 0,
                            "ttl_tax": "0",
                            "ttl_igst": "0",
                            "ttl_sgst": "0",
                            "ttl_cgst": "0",
                            "ttl_val": "0",
                            "ttl_cess": "0"
                        }
                    ]
                }
            ]
        }
    }
};

  const {handleOnlineGSTRModalClose,updateStep,onlineGSTRDialogOpen,b2bSalesList,step} = stores.GSTR1Store;

  useEffect(() => {
    console.log("respp",resp);
    validateSession();
  }, []);

  const handleLoaderAlertClose = () => {
    setLoader(false);
  };


  const generateOTP = async () => {

    setLoaderMsg("Please wait!!!");
    setLoader(true);

    let reqData = {};
    if(b2bSalesList){
      console.log('b2bSalesList',b2bSalesList);
    }
    reqData = {
      gstin: resp?.gstin,
      username: username
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/otp',
        // `${API_SERVER}/v1/gst/gst-zen/otp`,
        reqData
      )
      .then(async (response) => {
        if(response.data.status == 1){
          setLoginStep(2);
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };

  const validateOTP = async () => {
    setLoaderMsg("Please wait!!!");
    setLoader(true);

    let reqData = {};
    reqData = {
      gstin: resp?.gstin,
      otp: otp
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/session',
        reqData
      )
      .then(async (response) => {
        setLoader(false);
        if(response.data.status == 1){
          updateStep(2);
        }
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };

  const validateSession = async () => {
    let reqData = {};
    setLoaderMsg("Please wait while validating session!!!");
    setLoader(true);
    reqData = {
      gstin: resp?.gstin
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/session/validate',
        reqData
      )
      .then(async (response) => {
        setLoader(false);
        if(response.data.status == 1 && response.data.message == 'Your GSTN portal session is active'){
          updateStep(2);
          returnsValidate();
        }else{
          updateStep(2);
          returnsValidate();
        }
      })
      .catch((err) => {
        setLoader(false);
        updateStep(2);
        returnsValidate();
        throw err;
      });
  };


  const saveGSTR1 = async () => {
    let reqData = {};
    
    reqData = resp;

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/save/gstr1',
        reqData
      )
      .then(async (response) => {
        if(response.data.status == 1){
          updateStep(3);
          myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const ref_id=response.data.message.reference_id;
          retStatus(ref_id);
        }
      })
      .catch((err) => {
        // setLoader(false);
        throw err;
      });
  };

  const resetGSTR1 = async () => {
    let reqData = {};
    setLoaderMsg("Please wait!!!");
    setLoader(true);
    reqData = {
      gstin: resp?.gstin,
      fp: resp?.fp
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/reset/gstr1',
        reqData
      )
      .then(async (response) => {
        setLoader(false);
        updateStep(2);
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };
  const returnsValidate = async () => {
    let reqData = {};
    reqData = resp;

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/os/returns/validate',
        reqData
      )
      .then(async (response) => {
        setLoader(false);
        if(response.data.success == true){
          // updateStep(3);
          // downloadGSTR1();
        }
        
        // 
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };

  const saveValidate = async () => {

    setConfirmSummary(false);
    setLoaderMsg("Please wait!!!");
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: resp?.gstin,
      fp: resp?.fp
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/returns/os/save/validate',
        reqData
      )
      .then(async (response) => {
        if(response.data.success == false){
          saveGSTR1();
        }else{
          myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const ref_id=response.data.message.reference_id;
          downloadGSTR1();
        }
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };

  const fileValidate = async () => {

    setConfirmSummary(false);
    setLoaderMsg("Please wait!!!");
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: resp?.gstin,
      fp: resp?.fp
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/returns/os/file/validate',
        reqData
      )
      .then(async (response) => {
        if(response.data.success == false){
          setLoader(false);
          proceedToFinal();
        }else{
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };


  const downloadGSTR1 = async () => {
    let reqData = {};
    reqData = {
      "gstin": resp?.gstin,
      "fp": resp?.fp,
      "api_name": "retsum"
    };
    
    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/download/gstr1',
        reqData
      )
      .then(async (response) => {
        setLoader(false);
        setDownloadData(response.data?.message?.data);
      })
      .catch((err) => {
        setDownloadData(downloadJSON.message.data);
        setLoader(false);
        throw err;
      });
  };


  const retStatus = async (ref_id) => {
    let reqData = {};
    reqData = {
      "gstin": resp?.gstin,
      "fp": resp?.fp,
      "reference_id": ref_id
    };
    await axios
      .post(
        'https://my.gstzen.in/api/gstr1/retstatus/',
        reqData
      )
      .then(async (response) => {
        downloadGSTR1();
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };

  const toggleAnswerVisibility = (category) => {
    setMoreVisibility((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  const handleConfirmSummaryClose = () => {
    setConfirmSummary(false);
  };
  const proceedReview = () => {
    setConfirmSummary(true);
  };
  const proceedToFinal = () => {
    updateStep(4);
  };
  
  const proceedToEvcOtp = async () => {
    setLoaderMsg("Please wait!!!");
    setLoader(true);

    let reqData = {};
    reqData = {
      fp: resp?.fp,
      gstin: resp?.gstin,
      authorized_signatory_pan: pan
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/file/evc/otp',
        reqData
      )
      .then(async (response) => {
        setLoader(false);
        if(response.data.status == 1){
          setFinalStep(2);
        }
      })
      .catch((err) => {
        setFinalStep(2);
        setLoader(false);
        throw err;
      });
    
  };
  const proceedToFile = async () => {
    setLoaderMsg("Please wait!!!");
    setLoader(true);

    let reqData = {};
    reqData = {
      fp: resp?.fp,
      gstin: resp?.gstin,
      otp: evcotp,
      authorized_signatory_pan: pan,
      json_data: downloadData
    };

    await axios
      .post(
        'https://api.oneshell.in/v1/gst/gst-zen/file/gstr1/evc',
        reqData
      )
      .then(async (response) => {
        setLoader(false);
        // if(response.data.status == 1){
        //   updateStep(4);
        // }
      })
      .catch((err) => {
        // updateStep(4);
        setLoader(false);
        throw err;
      });
    
  };

  

  return (
    <>
    <Dialog
      open={onlineGSTRDialogOpen}
      fullScreen
      onClose={handleOnlineGSTRModalClose}
    >
      <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
        GST Portal
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleOnlineGSTRModalClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <section ref={myRef} style={{marginTop:'3%'}}>
          <ProgressBar>
            <ProgressBarStep className={step >= 1 && "is-complete"}>
              <ProgressBarIcon />
              <ProgressBarStepLabel>Login</ProgressBarStepLabel>
            </ProgressBarStep>
            <ProgressBarStep className={step >= 2 && "is-complete"}>
              <ProgressBarIcon />
              <ProgressBarStepLabel>RETURN Save</ProgressBarStepLabel>
            </ProgressBarStep>
            <ProgressBarStep className={step >= 3 && "is-complete"}>
              <ProgressBarIcon />
              <ProgressBarStepLabel>Summary Review</ProgressBarStepLabel>
            </ProgressBarStep>
            <ProgressBarStep className={step >= 4 && "is-complete"}>
              <ProgressBarIcon />
              <ProgressBarStepLabel>RETURN File</ProgressBarStepLabel>
            </ProgressBarStep>
          </ProgressBar>
        </section>
        {step == 1 &&<div className={classes.step1}>
          <Typography style={{padding:'10px'}} variant="h6">
            GSTIN : {resp?.gstin}
          </Typography>
          <Typography style={{padding:'10px'}} variant="h6">
            FP : {resp?.fp}
          </Typography>
          {loginStep == 1 &&<div className={classes.fGroup}>
            <Grid container direction="row" alignItems="stretch">
              <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <FormControl style={{marginBottom:'6%'}} fullWidth>
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
                    onChange={(e)=>setUsername(e.target.value)}
                  />
                </FormControl>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={generateOTP}
                  style={{width:'100%'}}
                >Submit</Button>
              </Grid>
            </Grid>
          </div>}

          {loginStep == 2 &&<div className={classes.fGroup}>
            <Grid container direction="row" alignItems="stretch">
              <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <FormControl style={{marginBottom:'6%'}} fullWidth>
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
                    onChange={(e)=>setOtp(e.target.value)}
                  />
                </FormControl>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={validateOTP}
                  style={{width:'100%'}}
                >Login</Button>
              </Grid>
            </Grid>
          </div>}
        </div>}

        {step == 2 &&<div className={classes.step2}>
          <Typography style={{padding:'10px'}} variant="h3">
            Summary 
          </Typography>
          <div>
            <Grid container direction="row" alignItems="stretch">
              {b2b &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>

                <div className={classes.CenterStartEndWc} style={{backgroundColor:'#FF6666',color:'#fff',marginBottom:'10px'}}>
                  <Typography style={{padding:'10px'}} variant="h4">
                    B2B Invoices
                  </Typography>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2bTitle')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['b2bTitle'] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                    </IconButton>
                  </div>
                </div>
                <div style={{ display: moreVisibility['b2bTitle'] ? 'block' : 'none' }}>
                  {b2b?.map((pitem,index) => (<div className={classes.mb_10}>
                    <div className={classes.CenterStartEnd} >
                      <div style={{display:'flex'}}>
                        <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                          GSTIN : {pitem?.ctin}
                        </Typography>
                        <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                          Total : {pitem?.inv?.length}
                        </Typography>
                      </div>
                      <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2b_'+index)}>
                        <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                        {moreVisibility['b2b_'+index] ? (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                          ) : (
                            <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                        )}
                        </IconButton>
                      </div>
                    </div>
                    <div className="answer" style={{ display: moreVisibility['b2b_'+index] ? 'block' : 'none' }}>
                      <div style={{marginTop:'10px'}}>
                        <table className={`${classes.batchTable}`}>
                          <thead>
                            <tr>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Invoice Number
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Invoice Date
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Value
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                POS
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pitem?.inv?.map((item) => (
                              <tr>
                                <td className={`${classes.rowstyle}`}>
                                  {item.inum}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.idt}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.val}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.pos}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>))}
                </div>
                
              </Grid>}

              {b2cl &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                
                <div className={classes.CenterStartEndWc} style={{backgroundColor:'#FF6666',color:'#fff',marginBottom:'10px'}}>
                  <Typography style={{padding:'10px'}} variant="h4">
                    B2CL
                  </Typography>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2clTitle')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['b2clTitle'] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                    </IconButton>
                  </div>
                </div>
                <div style={{ display: moreVisibility['b2clTitle'] ? 'block' : 'none' }}>
                  {b2cl?.map((pitem,index) => (<div className={classes.mb_10}>
                    <div className={classes.CenterStartEnd} >
                      <div style={{display:'flex'}}>
                        <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                          POS : {pitem?.pos}
                        </Typography>
                        <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                          Total : {pitem?.inv?.length}
                        </Typography>
                      </div>
                      <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2cl_'+index)}>
                        <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                        {moreVisibility['b2cl_'+index] ? (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                          ) : (
                            <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                        )}
                        </IconButton>
                      </div>
                    </div>
                    <div className="answer" style={{ display: moreVisibility['b2cl_'+index] ? 'block' : 'none' }}>
                      <div style={{marginTop:'10px'}}>
                        <table className={`${classes.batchTable}`}>
                          <thead>
                            <tr>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Invoice Number
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Invoice Date
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pitem?.inv?.map((item) => (
                              <tr>
                                <td className={`${classes.rowstyle}`}>
                                  {item.inum}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.idt}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.val}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>))}
                </div>
              </Grid>}

              {cdnr &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                
                <div className={classes.CenterStartEndWc} style={{backgroundColor:'#FF6666',color:'#fff',marginBottom:'10px'}}>
                  <Typography style={{padding:'10px'}} variant="h4">
                    CDNR
                  </Typography>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('cdnrTitle')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['cdnrTitle'] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                    </IconButton>
                  </div>
                </div>
                <div style={{ display: moreVisibility['cdnrTitle'] ? 'block' : 'none' }}>
                  {cdnr?.map((pitem,index) => (<div className={classes.mb_10}>
                    <div className={classes.CenterStartEnd} >
                      <div style={{display:'flex'}}>
                        <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                          GSTIN : {pitem?.ctin}
                        </Typography>
                        <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                          Total : {pitem?.nt?.length}
                        </Typography>
                      </div>
                      <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('cdnr_'+index)}>
                        <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                        {moreVisibility['cdnr_'+index] ? (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                          ) : (
                            <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                        )}
                        </IconButton>
                      </div>
                    </div>
                    <div className="answer" style={{ display: moreVisibility['cdnr_'+index] ? 'block' : 'none' }}>
                      <div style={{marginTop:'10px'}}>
                        <table className={`${classes.batchTable}`}>
                          <thead>
                            <tr>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                ntty
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                nt_num
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                nt_dt
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                pos
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pitem?.nt?.map((item) => (
                              <tr>
                                <td className={`${classes.rowstyle}`}>
                                  {item.ntty}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.nt_num}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.nt_dt}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.pos}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>))}
                </div>
              </Grid>}

              {b2cs &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                
                <div className={classes.CenterStartEndWc} style={{backgroundColor:'#FF6666',color:'#fff'}}>
                  <Typography style={{padding:'10px'}} variant="h4">
                    B2CS
                  </Typography>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2csTitle')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['b2csTitle'] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                    </IconButton>
                  </div>
                </div>
                {/* <div className={classes.CenterStartEnd} >
                  <div style={{display:'flex'}}>
                  </div>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2cs')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                    {moreVisibility['b2cs'] ? (
                      <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                      ) : (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                    )}
                    </IconButton>
                  </div>
                </div> */}
                
                <div className="answer" style={{ display: moreVisibility['b2csTitle'] ? 'block' : 'none' }}>
                  <div style={{marginTop:'10px'}}>
                    <table className={`${classes.batchTable}`}>
                      <thead>
                        <tr>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            POS
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Rate
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Taxable Value
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            CGST
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            SGST
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            IGST
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {b2cs?.map((item) => (
                          <tr>
                            <td className={`${classes.rowstyle}`}>
                              {item.pos}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.rt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.txval}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.camt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.samt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.csamt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>}

              {cdnur &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                
                <div className={classes.CenterStartEndWc} style={{backgroundColor:'#FF6666',color:'#fff'}}>
                  <Typography style={{padding:'10px'}} variant="h4">
                    CDNUR
                  </Typography>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('cdnurTitle')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['cdnurTitle'] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                    </IconButton>
                  </div>
                </div>
                
                <div className="answer" style={{ display: moreVisibility['cdnurTitle'] ? 'block' : 'none' }}>
                  <div style={{marginTop:'10px'}}>
                    <table className={`${classes.batchTable}`}>
                      <thead>
                        <tr>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            POS
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Invoice Number
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cdnur?.map((item) => (
                          <tr>
                            <td className={`${classes.rowstyle}`}>
                              {item.pos}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.nt_num}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>}  

              {doc &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                
                <div className={classes.CenterStartEndWc} style={{backgroundColor:'#FF6666',color:'#fff',marginBottom:'10px'}}>
                  <Typography style={{padding:'10px'}} variant="h4">
                    Document Summary
                  </Typography>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('docTitle')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['docTitle'] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                    </IconButton>
                  </div>
                </div>
                <div style={{ display: moreVisibility['docTitle'] ? 'block' : 'none' }}>
                  {doc?.doc_det?.map((pitem,index) => (<div className={classes.mb_10}>
                    <div className={classes.CenterStartEnd} >
                      <div style={{display:'flex'}}>
                        <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                          {pitem?.doc_typ}
                        </Typography>
                      </div>
                      <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('doc_'+index)}>
                        <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                        {moreVisibility['doc_'+index] ? (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                          ) : (
                            <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                        )}
                        </IconButton>
                      </div>
                    </div>
                    <div className="answer" style={{ display: moreVisibility['doc_'+index] ? 'block' : 'none' }}>
                      <div style={{marginTop:'10px'}}>
                        <table className={`${classes.batchTable}`}>
                          <thead>
                            <tr>
                              {/* <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Document Type
                              </th> */}
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                First Slno
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Last Slno
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Total
                              </th>
                              <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                Cancelled
                              </th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {pitem?.docs?.map((item) => (
                              <tr>
                                {/* <td className={`${classes.rowstyle}`}>
                                  {item.doc_typ}
                                </td> */}
                                <td className={`${classes.rowstyle}`}>
                                  {item.from}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.to}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.totnum}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {item.cancel}
                                </td>
                                
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>))}
                </div>
              </Grid>}  


              {hsn &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                
                <div className={classes.CenterStartEndWc} style={{backgroundColor:'#FF6666',color:'#fff'}}>
                  <Typography style={{padding:'10px'}} variant="h4">
                    HSN Summary
                  </Typography>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('hsnTitle')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['hsnTitle'] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                    </IconButton>
                  </div>
                </div>
                
                <div className="answer" style={{ display: moreVisibility['hsnTitle'] ? 'block' : 'none' }}>
                  <div style={{marginTop:'10px'}}>
                    <table className={`${classes.batchTable}`}>
                      <thead>
                        <tr>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            HSN Code
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Qty
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Unit
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Tax Rate
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Taxable Amount
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            CAMT
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            SAMT
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            IAMT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hsn?.data?.map((item) => (
                          <tr>
                            <td className={`${classes.rowstyle}`}>
                              {item.hsn_sc}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.qty}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.uqc}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.rt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.txval}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.camt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.samt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.csamt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>}

              
              <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={proceedReview}
                    style={{float:'right'}}
                  >Submit</Button> 
              </Grid>
                    
              
            </Grid>
          </div>
        </div>}

        {step == 3 &&<div className={classes.step2}>
          <Typography style={{padding:'10px'}} variant="h3">
            Summary Review
          </Typography>

          <Grid container direction="row" alignItems="stretch">
              {b2b &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Typography style={{padding:'10px'}} variant="h4">
                  B2B Invoices
                </Typography>

                {b2b?.map((pitem,index) => (<div className={classes.mb_10}>
                  <div className={classes.CenterStartEnd} >
                    <div style={{display:'flex'}}>
                      <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                        GSTIN : {pitem?.ctin}
                      </Typography>
                      <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                        Total : {pitem?.inv?.length}
                      </Typography>
                    </div>
                    <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2b_'+index)}>
                      <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['b2b_'+index] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                      </IconButton>
                    </div>
                  </div>
                  <div className="answer" style={{ display: moreVisibility['b2b_'+index] ? 'block' : 'none' }}>
                    <div style={{marginTop:'10px'}}>
                      <table className={`${classes.batchTable}`}>
                        <thead>
                          <tr>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              Invoice Number
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              Invoice Date
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              Value
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              POS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pitem?.inv?.map((item) => (
                            <tr>
                              <td className={`${classes.rowstyle}`}>
                                {item.inum}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.idt}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.val}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.pos}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>))}
                
              </Grid>}

              {b2cl &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Typography style={{padding:'10px'}} variant="h4">
                  B2CL
                </Typography>
                {b2cl?.map((pitem,index) => (<div className={classes.mb_10}>
                  <div className={classes.CenterStartEnd} >
                    <div style={{display:'flex'}}>
                      <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                        POS : {pitem?.pos}
                      </Typography>
                      <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                        Total : {pitem?.inv?.length}
                      </Typography>
                    </div>
                    <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2cl_'+index)}>
                      <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['b2cl_'+index] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                      </IconButton>
                    </div>
                  </div>
                  <div className="answer" style={{ display: moreVisibility['b2cl_'+index] ? 'block' : 'none' }}>
                    <div style={{marginTop:'10px'}}>
                      <table className={`${classes.batchTable}`}>
                        <thead>
                          <tr>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              Invoice Number
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              Invoice Date
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pitem?.inv?.map((item) => (
                            <tr>
                              <td className={`${classes.rowstyle}`}>
                                {item.inum}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.idt}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.val}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>))}
              </Grid>}

              {cdnr &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Typography style={{padding:'10px'}} variant="h4">
                  CDNR
                </Typography>
                {cdnr?.map((pitem,index) => (<div className={classes.mb_10}>
                  <div className={classes.CenterStartEnd} >
                    <div style={{display:'flex'}}>
                      <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                        GSTIN : {pitem?.ctin}
                      </Typography>
                      <Typography style={{padding:'10px',color:'#fff'}} variant="h6">
                        Total : {pitem?.nt?.length}
                      </Typography>
                    </div>
                    <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('cdnr_'+index)}>
                      <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                      {moreVisibility['cdnr_'+index] ? (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                        ) : (
                          <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                      )}
                      </IconButton>
                    </div>
                  </div>
                  <div className="answer" style={{ display: moreVisibility['cdnr_'+index] ? 'block' : 'none' }}>
                    <div style={{marginTop:'10px'}}>
                      <table className={`${classes.batchTable}`}>
                        <thead>
                          <tr>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              ntty
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              nt_num
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              nt_dt
                            </th>
                            <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                              pos
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pitem?.nt?.map((item) => (
                            <tr>
                              <td className={`${classes.rowstyle}`}>
                                {item.ntty}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.nt_num}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.nt_dt}
                              </td>
                              <td className={`${classes.rowstyle}`}>
                                {item.pos}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>))}
              </Grid>}

              {b2cs &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Typography style={{padding:'10px'}} variant="h4">
                  B2CS
                </Typography>
                <div className={classes.CenterStartEnd} >
                  <div style={{display:'flex'}}>
                    
                  </div>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('b2cs')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                    {moreVisibility['b2cs'] ? (
                      <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                      ) : (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                    )}
                    </IconButton>
                  </div>
                </div>
                <div className="answer" style={{ display: moreVisibility['b2cs'] ? 'block' : 'none' }}>
                  <div style={{marginTop:'10px'}}>
                    <table className={`${classes.batchTable}`}>
                      <thead>
                        <tr>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            POS
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Rate
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Taxable Value
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            CGST
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            SGST
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            IGST
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {b2cs?.map((item) => (
                          <tr>
                            <td className={`${classes.rowstyle}`}>
                              {item.pos}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.rt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.txval}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.csamt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.csamt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.iamt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>}

              {cdnur &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Typography style={{padding:'10px'}} variant="h4">
                  CDNUR
                </Typography>
                <div className={classes.CenterStartEnd} >
                  <div style={{display:'flex'}}>
                   
                  </div>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('cdnur')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                    {moreVisibility['cdnur'] ? (
                      <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                      ) : (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                    )}
                    </IconButton>
                  </div>
                </div>
                <div className="answer" style={{ display: moreVisibility['cdnur'] ? 'block' : 'none' }}>
                  <div style={{marginTop:'10px'}}>
                    <table className={`${classes.batchTable}`}>
                      <thead>
                        <tr>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            POS
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Invoice Number
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cdnur?.map((item) => (
                          <tr>
                            <td className={`${classes.rowstyle}`}>
                              {item.pos}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.nt_num}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>}    


              {hsn &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Typography style={{padding:'10px'}} variant="h4">
                  HSN Summary
                </Typography>
                <div className={classes.CenterStartEnd} >
                  <div style={{display:'flex'}}>
                   
                  </div>
                  <div style={{cursor:'pointer'}} onClick={() => toggleAnswerVisibility('hsn')}>
                    <IconButton aria-label="chevron circle up" style={{color:'#fff',padding:'0px'}}>
                    {moreVisibility['hsn'] ? (
                      <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">Hide Details </Typography><KeyboardArrowDownIcon /></>
                      ) : (
                        <><Typography style={{padding:'10px',color:'#fff'}} variant="h6">View Details </Typography><KeyboardArrowDownIcon /></>
                    )}
                    </IconButton>
                  </div>
                </div>
                <div className="answer" style={{ display: moreVisibility['hsn'] ? 'block' : 'none' }}>
                  <div style={{marginTop:'10px'}}>
                    <table className={`${classes.batchTable}`}>
                      <thead>
                        <tr>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            HSN Code
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Qty
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Unit
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Tax Rate
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            Taxable Amount
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            CAMT
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            SAMT
                          </th>
                          <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                            IAMT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hsn?.data?.map((item) => (
                          <tr>
                            <td className={`${classes.rowstyle}`}>
                              {item.num}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.qty}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.uqc}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.rt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.txval}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.csamt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.csamt}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {item.iamt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Grid>}
              <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={fileValidate}
                    style={{float:'right',marginLeft: '10px'}}
                  >Proceed to File</Button> 
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={resetGSTR1}
                    style={{float:'right'}}
                  >Reset Data</Button> 
                
              </Grid>
            </Grid>



          

          <div>
            
          </div>
        </div>}

        {step == 4 &&<div className={classes.step1}>
          <div className={classes.fGroup}>
            <Grid container direction="row" alignItems="stretch">
              {finalStep == 1 &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                
                <FormControl style={{marginBottom:'6%'}} fullWidth>
                  <Typography component="subtitle1">PAN</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="Enter OTP"
                    value={pan}
                    onChange={(e)=>setPAN(e.target.value)}
                  />
                </FormControl>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={proceedToEvcOtp}
                  style={{width:'100%'}}
                >Generate OTP</Button>
              </Grid>}

              {finalStep == 2 &&<Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                <FormControl style={{marginBottom:'6%'}} fullWidth>
                  <Typography component="subtitle1">OTP</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="Enter OTP"
                    value={evcotp}
                    onChange={(e)=>setEvcOtp(e.target.value)}
                  />
                </FormControl>
                
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={proceedToFile}
                  style={{width:'100%'}}
                >Complete</Button>
              </Grid>}
            </Grid>
          </div>
        </div>}
      </DialogContent>
    </Dialog>

    <Dialog
      open={confirmSummary}
      fullWidth={true}
      maxWidth={'sm'}
      onClose={handleConfirmSummaryClose}
    >
      <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleConfirmSummaryClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={`${classes.productModalContent} ${classes.wAuto}`}>
        <Typography variant="h4" className={classes.mb_20}>Do you wish to confirm?</Typography>
        <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
          <div className={classes.CenterStartEndWc} >
            <Button
                color="secondary"
                variant="outlined"
                onClick={handleConfirmSummaryClose}
                style={{float:'right'}}
              >Cancel</Button> 
            <Button
                color="secondary"
                variant="outlined"
                onClick={saveValidate}
                style={{float:'right'}}
              >Yes</Button> 
            </div>
        </Grid>
      </DialogContent>
    </Dialog>

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

export default injectWithObserver(OnlineGSTRModal);
