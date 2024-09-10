import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import useWindowDimensions from '../../../components/windowDimension';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import * as Db from 'src/RxDb/Database/Database';
import { useTheme } from '@material-ui/core/styles';
import Controls from '../../../components/controls/index';

import {
  makeStyles,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  Checkbox,
  Button,
  DialogContentText,
  withStyles,
  TextField,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Select,
  MenuItem
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { Grid, Col } from 'react-flexbox-grid';
import '../style.css';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 18
    // textAlign: 'center',
  },
  containerLeft: {
    width: '12%',
    minHeight: '590px'
  },
  containerRight: {
    width: '88%'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  p: {
    fontWeight: 'bold'
  },
  card: {
    height: '100%'
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
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

const SplitPaymentSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const {
    setBankAccounts,
    setCash,
    setBank,
    setBankChecked,
    setGiftCard,
    setCustomFinance,
    removeCustomFinance,
    addCustomFinance,
    getSplitPaymentSettingdetails,
    addGiftCard,
    removeGiftCard,
    setDefaultBank,
    setExchange,
    addExchange,
    removeExchange
  } = stores.SplitPaymentSettingsStore;

  const { bankAccounts, splitPaymentSettingData } = toJS(
    stores.SplitPaymentSettingsStore
  );

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const { height } = useWindowDimensions();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [customFinanceDialogOpen, setCustomFinanceDialogOpen] = useState(false);
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const [customFinanceName, setCustomFinanceName] = React.useState('');
  const [customGiftCardName, setCustomGiftCardName] = React.useState('');
  const [customGiftCardDialogOpen, setCustomGiftCardDialogOpen] =
    useState(false);
  const [exchangeDialogOpen, setExchangeDialogOpen] =
    useState(false);
  const [exchangeName, setExchangeName] = React.useState('');

  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  const handleCustomFinanceDialogOpenClose = () => {
    setCustomFinanceDialogOpen(false);
  };

  const handleCustomGiftCardDialogOpen = () => {
    setCustomGiftCardDialogOpen(true);
  };

  const handleCustomGiftCardDialogOpenClose = () => {
    setCustomGiftCardDialogOpen(false);
  };

  const handleCustomFinanceDialogOpen = () => {
    setCustomFinanceDialogOpen(true);
  };

  const handleExchangeDialogOpen = () => {
    setExchangeDialogOpen(true);
  };

  const handleExchangeDialogOpenClose = () => {
    setExchangeDialogOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getBankAccounts();
      getSplitPaymentSettingdetails();
    }

    fetchData();
  }, []);

  const getBankAccounts = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    let list = [];
    let query = db.bankaccounts.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let bankAccounts = data.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.enabled = false;
        return item;
      });

      setBankAccounts(bankAccounts);
    });
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Settings')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <div>
      <Grid fluid className="app-main" style={{ height: height - 50 }}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <>
            {isFeatureAvailable ? (
              <Paper
                className={classes.paper}
                style={{ height: height - 62 + 'px', overflowY: 'auto' }}
              >
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                  Payment Mode Settings
                </Typography>
                <Grid container>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ display: 'block' }}
                      control={
                        <Switch
                          disabled={true}
                          checked={splitPaymentSettingData.cashEnabled}
                          onChange={(e) => {
                            setCash(e.target.checked);
                          }}
                          name="cash"
                        />
                      }
                      label="Cash is enabled by default"
                    />
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <Divider variant="li" />
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ display: 'block' }}
                      control={
                        <Switch
                          checked={splitPaymentSettingData.bankEnabled}
                          onChange={(e) => {
                            setBank(e.target.checked);
                          }}
                          name="bank"
                        />
                      }
                      label="Bank"
                    />
                  </Grid>
                  {splitPaymentSettingData.bankEnabled === true && (
                    <Grid container>
                      {bankAccounts &&
                        bankAccounts.map((prodEle, index) => (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row'
                            }}
                          >
                            <FormControl variant="standard">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={prodEle.enabled}
                                    name={prodEle.accountDisplayName}
                                    className={classes.tickSize}
                                    onChange={(e) => {
                                      setBankChecked(index, e.target.checked);
                                    }}
                                  />
                                }
                                label={prodEle.accountDisplayName}
                              />
                            </FormControl>
                          </div>
                        ))}
                    </Grid>
                  )}

                  <Grid item xs={4} className="grid-padding">
                    <FormControl          
                      variant="outlined"
                      className={classes.formControl}
                      margin="dense"
                    >
                      <Typography component="subtitle1">
                        Select Default Bank to display
                      </Typography>

                      <Select
                        displayEmpty
                        value={
                          splitPaymentSettingData.defaultBankSelected
                            ? splitPaymentSettingData.defaultBankSelected
                            : 'Select'
                        }
                        fullWidth
                        style={{ textAlign: 'center', marginTop: '10px' }}
                        onChange={async (e) => {
                          if (e.target.value !== 'Select') {
                            setDefaultBank(e.target.value);
                          } else {
                            setDefaultBank('');
                          }
                        }}
                      >
                        <MenuItem value={'Select'}>{'Select'}</MenuItem>
                        {bankAccounts.map((option, index) => (
                          <MenuItem value={option.accountDisplayName}>
                            {option.accountDisplayName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <Divider variant="li" />
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ display: 'block' }}
                      control={
                        <Switch
                          checked={splitPaymentSettingData.giftCardEnabled}
                          onChange={(e) => {
                            setGiftCard(e.target.checked);
                          }}
                          name="giftCard"
                        />
                      }
                      label="Gift Card/Scheme"
                    />
                  </Grid>
                  {splitPaymentSettingData.giftCardEnabled && (
                    <Grid item xs={12} style={{ marginTop: '16px' }}>
                      <Controls.Button
                        text="Add Gift Card/Scheme"
                        size="medium"
                        variant="contained"
                        color="primary"
                        className={classes.newButton}
                        onClick={() => handleCustomGiftCardDialogOpen()}
                      />

                      <div
                        style={{
                          width: '40%',
                          marginTop: '16px'
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexDirection: 'row' }}
                        ></div>
                        {splitPaymentSettingData.giftCardList &&
                          splitPaymentSettingData.giftCardList.length > 0 &&
                          splitPaymentSettingData.giftCardList.map(
                            (option, index) => (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  marginTop: '16px'
                                }}
                              >
                                <div
                                  style={{
                                    width: '50%',
                                    paddingLeft: '5px',
                                    paddingTop: '5px'
                                  }}
                                >
                                  {option}
                                </div>
                                <div
                                  style={{ width: '25%', textAlign: 'left' }}
                                >
                                  <DeleteIcon
                                    onClick={(e) => {
                                      removeGiftCard(index, option);
                                    }}
                                    className={classes.icon}
                                  />
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </Grid>
                  )}

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <Divider variant="li" />
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ display: 'block' }}
                      control={
                        <Switch
                          checked={splitPaymentSettingData.exchangeEnabled}
                          onChange={(e) => {
                            setExchange(e.target.checked);
                          }}
                          name="exchange"
                        />
                      }
                      label="Exchange"
                    />
                  </Grid>
                  {splitPaymentSettingData.exchangeEnabled && (
                    <Grid item xs={12} style={{ marginTop: '16px' }}>
                      <Controls.Button
                        text="Add Exchange"
                        size="medium"
                        variant="contained"
                        color="primary"
                        className={classes.newButton}
                        onClick={() => handleExchangeDialogOpen()}
                      />

                      <div
                        style={{
                          width: '40%',
                          marginTop: '16px'
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexDirection: 'row' }}
                        ></div>
                        {splitPaymentSettingData.exchangeList &&
                          splitPaymentSettingData.exchangeList.length > 0 &&
                          splitPaymentSettingData.exchangeList.map(
                            (option, index) => (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  marginTop: '16px'
                                }}
                              >
                                <div
                                  style={{
                                    width: '50%',
                                    paddingLeft: '5px',
                                    paddingTop: '5px'
                                  }}
                                >
                                  {option}
                                </div>
                                <div
                                  style={{ width: '25%', textAlign: 'left' }}
                                >
                                  <DeleteIcon
                                    onClick={(e) => {
                                      removeExchange(index, option);
                                    }}
                                    className={classes.icon}
                                  />
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </Grid>
                  )}

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <Divider variant="li" />
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ display: 'block' }}
                      control={
                        <Switch
                          checked={splitPaymentSettingData.customFinanceEnabled}
                          onChange={(e) => {
                            setCustomFinance(e.target.checked);
                          }}
                          name="customFinance"
                        />
                      }
                      label="Custom/3rd Party Finance"
                    />
                  </Grid>
                  {splitPaymentSettingData.customFinanceEnabled && (
                    <Grid item xs={12} style={{ marginTop: '16px' }}>
                      <Controls.Button
                        text="Add Custom/3rd Party Finance"
                        size="medium"
                        variant="contained"
                        color="primary"
                        className={classes.newButton}
                        onClick={() => handleCustomFinanceDialogOpen()}
                      />

                      <div
                        style={{
                          width: '40%',
                          marginTop: '16px'
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexDirection: 'row' }}
                        ></div>
                        {splitPaymentSettingData.customFinanceList &&
                          splitPaymentSettingData.customFinanceList.length >
                            0 &&
                          splitPaymentSettingData.customFinanceList.map(
                            (option, index) => (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  marginTop: '16px'
                                }}
                              >
                                <div
                                  style={{
                                    width: '50%',
                                    paddingLeft: '5px',
                                    paddingTop: '5px'
                                  }}
                                >
                                  {option}
                                </div>
                                <div
                                  style={{ width: '25%', textAlign: 'left' }}
                                >
                                  <DeleteIcon
                                    onClick={(e) => {
                                      removeCustomFinance(index, option);
                                    }}
                                    className={classes.icon}
                                  />
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            ) : (
              <NoPermission />
            )}
          </>
        )}
      </Grid>

      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={customFinanceDialogOpen}
        onClose={handleCustomFinanceDialogOpenClose}
      >
        <DialogTitle id="product-modal-title">
          Add Custom Finance
          <IconButton
            aria-label="close"
            onClick={handleCustomFinanceDialogOpenClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography component="subtitle1">Name</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Custom Finance Name"
                  value={customFinanceName}
                  onChange={(event) => setCustomFinanceName(event.target.value)}
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
              if (customFinanceName === '') {
                setErrorMessage('Finance Name cannot be left blank');
                setOpenErrorMesssageDialog(true);
              } else {
                addCustomFinance(customFinanceName);
                setCustomFinanceName('');
                handleCustomFinanceDialogOpenClose();
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={customGiftCardDialogOpen}
        onClose={handleCustomGiftCardDialogOpenClose}
      >
        <DialogTitle id="product-modal-title">
          Add Gift Card/Schemes
          <IconButton
            aria-label="close"
            onClick={handleCustomGiftCardDialogOpenClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography component="subtitle1">Name</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Custom Gift Card Name"
                  value={customGiftCardName}
                  onChange={(event) =>
                    setCustomGiftCardName(event.target.value)
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
              if (customGiftCardName === '') {
                setErrorMessage('GiftCard Name cannot be left blank');
                setOpenErrorMesssageDialog(true);
              } else {
                addGiftCard(customGiftCardName);
                setCustomGiftCardName('');
                handleCustomGiftCardDialogOpenClose();
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={exchangeDialogOpen}
        onClose={handleExchangeDialogOpenClose}
      >
        <DialogTitle id="product-modal-title">
          Add Exchange
          <IconButton
            aria-label="close"
            onClick={handleExchangeDialogOpenClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography component="subtitle1">Name</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Exchange Name"
                  value={exchangeName}
                  onChange={(event) =>
                    setExchangeName(event.target.value)
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
              if (exchangeName === '') {
                setErrorMessage('Exchange Name cannot be left blank');
                setOpenErrorMesssageDialog(true);
              } else {
                addExchange(exchangeName);
                setExchangeName('');
                handleExchangeDialogOpenClose();
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

export default injectWithObserver(SplitPaymentSettings);