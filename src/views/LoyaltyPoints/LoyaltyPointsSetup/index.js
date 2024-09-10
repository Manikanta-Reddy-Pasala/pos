import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  withStyles,
  Checkbox,
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import styled, { css } from 'styled-components';
import useWindowDimensions from '../../../components/windowDimension';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';


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
    cursor: 'pointer',
    padding: '10px'
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
    backgroundColor: 'rgb(239, 83, 80)',
    color: '#fff'
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
  filterSection: {
    width: '100%',
    margin: 'auto',
    padding: '5%'
  },
  filterSectionSm: {
    width: '100%',
    margin: 'auto',
    padding: '0% 0 0% 5%'
  },
  centerDiv: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '-20%',
  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    fontSize: '12px',
    marginTop: '-8px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white',
    }
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '999',
    padding: '10px',
    backgroundColor: '#f6f8fa'
  },
  step3: {
    width: '40%',
    margin: 'auto',
    textAlign: 'center',
    fontSize: '20px',
  },
  CenterStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    margin: 'auto',
    padding: '5%'
  },
  success: {
    backgroundColor: '#0080002e',
    padding: '34px',
    borderRadius: '5px'
  },
  equal: {
    lineHeight: '2.5',
    padding: '10px'
  },
  f11: {
    fontSize: '11px'
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


const gray = '#f5f4f9';
const darkgray = '#f5f4f9';
const darkblue = '#0376e0';
const blue = '#FF6666';
const white = '#DBF1FF';
const green = '#07bd7c';

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
    height: 0.2em;
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
    background-color: ${green};
    width: 0%;
  }

  &.is-complete + &.is-current:after,
  &.is-complete + &.is-complete:after {
    width: 100%;
  }
`;

const ProgressBarIcon = styled.svg`
  width: 2.5em;
  height: 2.5em;
  background-color: ${gray};
  fill: ${gray};
  border-radius: 50%;
  padding: 0.5em;
  max-width: 100%;
  z-index: 10;
  position: relative;
  transition: all 1.75s ease-out;

  &:after {
    content: '1';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white; 
    font-size: 1em; 
  }

  ${ProgressBarStep}.is-current & {
    fill: ${darkblue};
    background-color: ${darkblue};
  }

  ${ProgressBarStep}.is-complete & {
    fill: ${white};
    background-color: ${green};
  }

  .is-complete & {
    fill: ${white};
    background-color: ${green};
  }

  
`;

const ProgressBarStepLabel = styled.span`
  display: block;
  font-weight:bold;
  text-transform: uppercase;
  color: #000;
  position: absolute;
  padding-top: 0.5em;
  width: 100%;
  font-size: 12px;
  transition: all 1.0s ease-out;

  ${ProgressBarStep}.is-current > &,
  ${ProgressBarStep}.is-complete > & {
    color: #000;
  }
`;

const Text = styled.text`
  fill: white;
  font-size: 1em;
  dominant-baseline: middle;
  text-anchor: middle;
  position: absolute;
  left: 49%;
  top: 21%;
  z-index: 99999999;
  color:#000;

  ${ProgressBarStep}.is-current & {
    color:#fff;
  }
  ${ProgressBarStep}.is-complete & {
    color:#fff;
  }
`;


const LoyaltyPointsSetup = (props) => {
  const stores = useStore();
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [step, setStep] = useState(1);
  const [isDays, setIsDays] = useState(false);

  const { setLoyaltySettingsData, getLoyaltySettingsData, saveData } = stores.LoyaltySettingsStore;

  const { loyaltySettingsData } = toJS(stores.LoyaltySettingsStore);

  const changeDays = (value) => {
    setIsDays(value);
  }

  useEffect(() => {
    getLoyaltySettingsData();
    console.log("loyaltySettingsData",loyaltySettingsData);

  }, []);




  return (
    <>
      <div style={{ width: '50%', margin: 'auto', backgroundColor: 'white', marginTop: '3%' }}>
        {/* <Typography className={`${classes.mb_10}`} style={{ padding: '10px', width: '95%', margin: 'auto' }} variant="h3">GSTR-3B - Monthly Return</Typography> */}

        <section style={{ padding: '1%' }}>
          <ProgressBar>
            <ProgressBarStep className={step > 1 ? "is-complete" : "is-current"}>
              <ProgressBarIcon />
              <Text x="50%" y="50%">1</Text>
              <ProgressBarStepLabel>Reward Setup</ProgressBarStepLabel>
            </ProgressBarStep>
            <ProgressBarStep className={step > 1 ? "is-current" : ""}>
              <ProgressBarIcon />
              <ProgressBarStepLabel>Redeem Setup</ProgressBarStepLabel>
              <Text x="50%" y="50%">2</Text>
            </ProgressBarStep>
          </ProgressBar>
        </section>

        <div className={classes.filterSectionSm}>
          <FormControlLabel
            control={
              <Checkbox
              checked={loyaltySettingsData.enableRedemption}
              onChange={(e) => {
                setLoyaltySettingsData(
                  'enableRedemption',
                  e.target.checked
                );
              }}
              />
            }
            label="Enable Redemption"
          />
        </div>

        {step == 1 && <div>
          <div className={classes.filterSection}>
            <Typography gutterBottom variant="h4" component="h6">
              Reward Setup
            </Typography>
            <div>
              <p>Loyalty Point Conversion</p>
              <div style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  required
                  style={{ width: '40%' }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  value={loyaltySettingsData.amountPerPoint}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'amountPerPoint',
                      e.target.value
                    );
                  }}
                  className="customTextField"
                  placeholder="Enter Amount"
                />
                <span className={classes.equal}>=</span>
                <TextField
                  fullWidth
                  required
                  style={{ width: '40%', backgroundColor: '#80808036', marginBottom: '8px' }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  value="1 Point"
                  className="customTextField"
                  placeholder="Enter Amount"
                />
              </div>
              <p className={classes.f11}>Award a loyalty point to your customers for all of their purchases at your store.</p>

            </div>
          </div>
          <div className={classes.filterSection} style={{ borderTop: '1px solid #80808042' }}>
            <div>
              <p>Minimum value of invoice for earning points</p>
              <div style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  required
                  style={{ width: '85%' }}
                  value={loyaltySettingsData.minValueToEarnPoints}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'minValueToEarnPoints',
                      e.target.value
                    );
                  }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Amount"
                />
              </div>
              <p className={classes.f11}>Customers must spent above your specified amount to get Loyalty points in each transaction.</p>

            </div>
          </div>
          <div className={classes.filterSectionSm}>
            <FormControlLabel
              control={
                <Checkbox
                checked={loyaltySettingsData.pointExpiry}
                onChange={(e) => {
                  setLoyaltySettingsData(
                    'pointExpiry',
                    e.target.checked
                  );
                }}
                />
              }
              label="Set Point Expiry"
            />

            {loyaltySettingsData.pointExpiry &&<TextField
              fullWidth
              required
              style={{ width: '85%' }}
              variant="outlined"
              margin="dense"
              type="text"
              value={loyaltySettingsData.expiryDays}
              onChange={(e) => {
                setLoyaltySettingsData(
                  'expiryDays',
                  e.target.value
                );
              }}
              className="customTextField"
              placeholder="Enter Days"
            />}
          </div>
          <div className={classes.filterSection}>
            <Button
              color="secondary"
              variant="outlined"
              style={{ float: 'right' }}
              onClick={() => { setStep(2); }}
              className={classes.filterBtn}
            >Next</Button>
          </div>

        </div>}

        {step == 2 && <div>
          <div className={classes.filterSection}>
            <Typography gutterBottom variant="h4" component="h6">
              Redeem Setup
            </Typography>
            <div>
              <p>Redemption Value</p>
              <div style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  required
                  style={{ width: '40%' }}
                  value={loyaltySettingsData.pointPerAmount}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'pointPerAmount',
                      e.target.value
                    );
                  }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Amount"
                />
                <span className={classes.equal}>=</span>
                <TextField
                  fullWidth
                  required
                  style={{ width: '40%', backgroundColor: '#80808036', marginBottom: '8px' }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  value="1"
                  className="customTextField"
                  placeholder="Enter Amount"
                />
              </div>
              <p className={classes.f11}>Each Loyalty point will give the user discount of 1.</p>

            </div>
          </div>
          <div className={classes.filterSection} style={{ borderTop: '1px solid #80808042' }}>
            
            <div style={{ marginTop: '0%' }}>
              <p>Minimum Invoice Value Needed to Start Redemption</p>
              <div style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  required
                  style={{ width: '85%' }}
                  value={loyaltySettingsData.minValueForRedemption}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'minValueForRedemption',
                      e.target.value
                    );
                  }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Amount"
                />
              </div>
              <p className={classes.f11}>Invoices below the given amount will be not able to redeem any loyalty discount.</p>
            </div>
            <div style={{ marginTop: '2%' }}>
              <p>Minimum Redemption Points </p>
              <div style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  required
                  value={loyaltySettingsData.minRedemptionPoints}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'minRedemptionPoints',
                      e.target.value
                    );
                  }}
                  style={{ width: '85%' }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Points"
                />
              </div>
            </div>
            <div style={{ marginTop: '2%' }}>
              <p>Maximum Redemption Points </p>
              <div style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  required
                  value={loyaltySettingsData.maxRedemptionPoints}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'maxRedemptionPoints',
                      e.target.value
                    );
                  }}
                  style={{ width: '85%' }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Points"
                />
              </div>
            </div>
            <div style={{ marginTop: '2%' }}>
              <p>Maximum Discount Allowed through Points </p>
              <div style={{ display: 'flex' }}>
                <TextField
                  fullWidth
                  required
                  value={loyaltySettingsData.maxDiscount}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'maxDiscount',
                      e.target.value
                    );
                  }}
                  style={{ width: '85%' }}
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Amount"
                />
              </div>
            </div>
            <FormControlLabel
              style={{ marginTop: '2%' }}
              control={
                <Checkbox
                  checked={loyaltySettingsData.otpRequired}
                  onChange={(e) => {
                    setLoyaltySettingsData(
                      'otpRequired',
                      e.target.checked
                    );
                  }}
                />
              }
              label="OTP Based Redemption"
            />
          </div>
          <div className={classes.CenterStartEnd} style={{ borderTop: '1px solid #80808042' }}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => { setStep(1); }}
              style={{ float: 'right' }}
              className={classes.filterBtn}
            >Back</Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={saveData}
              style={{ float: 'right' }}
              className={classes.filterBtn}
            >Submit</Button>
          </div>

        </div>}
      </div>

    </>
  );
};

export default injectWithObserver(LoyaltyPointsSetup);
