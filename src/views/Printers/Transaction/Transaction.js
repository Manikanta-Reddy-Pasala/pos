import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import NoPermission from '../../noPermission';
import * as Bd from '../../../components/SelectedBusiness';
import BubbleLoader from '../../../components/loader';
import Paper from '@material-ui/core/Paper';
import { toJS } from 'mobx';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';

import Button from '@material-ui/core/Button';
import {
  Grid,
  makeStyles,
  useTheme,
  Typography,
  TextField,
  Checkbox
} from '@material-ui/core';
import DisablePassCodeDialog from 'src/views/setting/SettingsView/DisablePassCodeDialog';
import { useStore } from 'src/Mobx/Helpers/UseStore';
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 2
  },
  cardPadding: {
    padding: '20px',
    height: '100vh'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  changePascode: {
    left: theme.spacing(2),
    margin: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  displayB: {
    display: 'block',
    marginBottom: '20px'
  },
  displayInline: {
    display: 'inline-block'
  },
  margintop: {
    margin: '20px'
  },
  selectOption: {
    '& .makeStyles-formControl-56': {
      marginTop: '-7px'
    }
  },
  marginl: {
    marginLeft: '-7px'
  },
  inputBox: {
    '& .MuiFormControl-root': {
      borderRadius: 0,
      width: '50px'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 0
    },
    '& .MuiInputBase-input': {
      background: 'white'
      // padding: '10px
    }
  },
  inputNumber: {
    textAlign: 'center',
    '& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
      {
        display: 'none'
      }
  },
  removeArrow: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: '#ef5350',
    color: 'white'
  },
  changeCode: {
    cursor: 'pointer'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0.5),
    color: 'white'
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(5)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const OldPassCode = () => (
  <div id="results" className="search-results">
    Some Results
  </div>
);

function Transaction() {
  const theme = useTheme();
  const classes = useStyles();
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const store = useStore();

  const {
    getTransactionData,
    setEnablePasscodeForDelete,
    setOnlineAlert,
    setSaleMoreThanStock
  } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);

  const [open, setOpen] = React.useState(false);
  const [isChangePassCode, setChangePassCode] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);

  const blockInvalidChar = (e) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const handleChangePasscodeClickOpen = () => {
    setChangePassCode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // TODO: Check if already checked and then perform false
    if (!transaction.enablePasscodeForDelete) {
      setEnablePasscodeForDelete(false);
    }
    setChangePassCode(false);
  };

  const setMaxLength = (e) => {
    e.target.value = Math.max(0, parseInt(e.target.value))
      .toString()
      .slice(0, 1);
  };

  const handleSavePasscode = () => {
    setOpen(false);
    setChangePassCode(false);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);

      getTransactionData();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if(!businessData.posFeatures.includes('Transaction Settings')) {
          setFeatureAvailable(false);
      }
    }
  };

  const handleDeletePasscodeClick = (value) => {
    setEnablePasscodeForDelete(value);

    if (value) {
      setPasswordOpen(true);
      setOpen(false);
    } else {
      setOpen(true);
      setPasswordOpen(false);
    }
  };

  return (
    <Grid style={{ padding: '0px', margin: '0px' }}>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <Grid>
          {isFeatureAvailable ? (
            <Paper className={classes.paper}>
              <div className={classes.cardPadding}>
                <Grid xs={12} style={{ display: 'flex' }}>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="enablePasscodeForDelete"
                          icon={
                            <CheckBoxOutlineBlankIcon
                              style={{ color: 'grey' }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxIcon style={{ color: '#Ef5350' }} />
                          }
                          defaultChecked={false}
                        />
                      }
                      label="Enable Pass Code for Transaction Delete"
                      value={transaction.enablePasscodeForDelete}
                      checked={transaction.enablePasscodeForDelete}
                      onChange={(event) => {
                        handleDeletePasscodeClick(event.target.value);
                      }}
                    />
                  </FormControl>

                  <Typography
                    onClick={handleChangePasscodeClickOpen}
                    style={{
                      color: '#0000FF',
                      marginLeft: '40px',
                      marginTop: '8px',
                      textDecorationLine: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Change Pass Code
                  </Typography>
                </Grid>

                <Grid xs={12} style={{ display: 'flex' }}>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="saleMoreThanStock"
                          icon={
                            <CheckBoxOutlineBlankIcon
                              style={{ color: 'grey' }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxIcon style={{ color: '#Ef5350' }} />
                          }
                          defaultChecked={false}
                        />
                      }
                      label="Sale More than Stock Alert"
                      value={transaction.saleMoreThanStock}
                      checked={transaction.saleMoreThanStock}
                      onChange={(event) =>
                        setSaleMoreThanStock(event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} style={{ display: 'flex' }}>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="onlineOrderAccept"
                          icon={
                            <CheckBoxOutlineBlankIcon
                              style={{ color: 'grey' }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxIcon style={{ color: '#Ef5350' }} />
                          }
                          defaultChecked={false}
                        />
                      }
                      label="Accept Online Order Alert"
                      value={transaction.onlineOrderAccept}
                      checked={transaction.onlineOrderAccept}
                      onChange={(event) => {
                        setOnlineAlert(event.target.checked);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Dialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                >
                  <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    {isChangePassCode ? 'Change Pass Code' : 'Setup Pass Code'}
                  </DialogTitle>
                  <DialogContent dividers>
                    {isChangePassCode ? (
                      <Typography gutterBottom>Old Pass Code</Typography>
                    ) : null}

                    {isChangePassCode ? (
                      <Grid xs={12} style={{ display: 'flex' }}>
                        <div className={classes.inputBox}>
                          <TextField
                            className={classes.removeArrow}
                            onInput={(e) => setMaxLength(e)}
                            onKeyDown={blockInvalidChar}
                            id="outlined-size-normal"
                            defaultValue=""
                            variant="outlined"
                            type="number"
                            inputProps={{
                              maxLength: 1,
                              className: classes.inputNumber
                            }}
                          />
                          <TextField
                            className={classes.removeArrow}
                            onInput={(e) => setMaxLength(e)}
                            onKeyDown={blockInvalidChar}
                            id="outlined-size-normal"
                            defaultValue=""
                            variant="outlined"
                            type="number"
                            inputProps={{
                              maxLength: 1,
                              className: classes.inputNumber
                            }}
                          />
                          <TextField
                            className={classes.removeArrow}
                            onInput={(e) => setMaxLength(e)}
                            onKeyDown={blockInvalidChar}
                            id="outlined-size-normal"
                            defaultValue=""
                            variant="outlined"
                            type="number"
                            inputProps={{
                              maxLength: 1,
                              className: classes.inputNumber
                            }}
                          />
                          <TextField
                            className={classes.removeArrow}
                            onInput={(e) => setMaxLength(e)}
                            onKeyDown={blockInvalidChar}
                            id="outlined-size-normal"
                            defaultValue=""
                            variant="outlined"
                            type="number"
                            inputProps={{
                              maxLength: 1,
                              className: classes.inputNumber
                            }}
                          />
                          <TextField
                            className={classes.removeArrow}
                            onInput={(e) => setMaxLength(e)}
                            onKeyDown={blockInvalidChar}
                            id="outlined-size-normal"
                            defaultValue=""
                            variant="outlined"
                            type="number"
                            inputProps={{
                              maxLength: 1,
                              className: classes.inputNumber
                            }}
                          />
                          <TextField
                            className={classes.removeArrow}
                            onInput={(e) => setMaxLength(e)}
                            onKeyDown={blockInvalidChar}
                            id="outlined-size-normal"
                            defaultValue=""
                            variant="outlined"
                            type="number"
                            inputProps={{
                              maxLength: 1,
                              className: classes.inputNumber
                            }}
                          />
                        </div>
                      </Grid>
                    ) : null}
                    <Typography gutterBottom style={{ paddingTop: '30px' }}>
                      New Pass Code
                    </Typography>

                    <Grid xs={12} style={{ display: 'flex' }}>
                      <div className={classes.inputBox}>
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{ className: classes.inputNumber }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                      </div>
                    </Grid>

                    <Typography gutterBottom style={{ paddingTop: '30px' }}>
                      Confirm Pass Code
                    </Typography>
                    <Grid xs={12} style={{ display: 'flex' }}>
                      <div className={classes.inputBox}>
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                        <TextField
                          className={classes.removeArrow}
                          onInput={(e) => setMaxLength(e)}
                          onKeyDown={blockInvalidChar}
                          id="outlined-size-normal"
                          defaultValue=""
                          variant="outlined"
                          type="number"
                          inputProps={{
                            maxLength: 1,
                            className: classes.inputNumber
                          }}
                        />
                      </div>
                    </Grid>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '30px'
                      }}
                    >
                      <div style={{ marginLeft: '100px' }}>
                        <Button variant="outlined" onClick={handleClose}>
                          Cancel
                        </Button>
                      </div>

                      <Button variant="outlined" onClick={handleSavePasscode}>
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <DisablePassCodeDialog
                  open={passwordOpen}
                ></DisablePassCodeDialog>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default InjectObserver(Transaction);
