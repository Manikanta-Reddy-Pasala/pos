import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@material-ui/core';
import Page from '../../../components/Page';
import Paper from '@material-ui/core/Paper';
import useWindowDimensions from '../../../components/windowDimension';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  Dialog,
  DialogContent,
  withStyles,
  IconButton,
  DialogContentText,
  Select,
  MenuItem,
  FormGroup,
  Checkbox
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import Controls from '../../../components/controls/index';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14
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
    width: '100%'
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
  resize: {
    width: '60px',
    height: '10px'
  },
  floatlabel: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 9999,
    marginLeft: '10px',
    marginTop: '-1px',
    padding: '0px 4px 0px 4px',
    fontSize: '11px'
  },
  reminderList: {
    padding: '5px',
    borderBottom: '1px solid #80808042 !important'
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

const ReminderSettings = () => {
  const classes = useStyles();
  const stores = useStore();

  const {
    handleReminderDialogOpenClose,
    updateReminderData,
    addReminderDay,
    updateReminderDay,
    removeReminderDay,
    addNewReminder,
    saveReminderData,
    editReminderData,
    deleteReminderData,
    changeReminderDataStatus,
    setReminderBySMS,
    setReminderByEmail,
    setReminderByWhatsApp,
    getReminders
  } = stores.RemindersStore;

  const {
    reminderData,
    currentReminderData,
    reminderDialogOpen,
    dailyType,
    isReminderEdit
  } = toJS(stores.RemindersStore);

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const { height } = useWindowDimensions();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
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
      await getReminders();
    }
    fetchData();
  }, []);

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

  const saveReminders = () => {
    //todo: days list empty check along with adding 0 for Before and After Due Date
    const ReminderDaylistValidate = currentReminderData.daysList?.map(
      (value, index) => {
        if (
          value.remindForDays !== 'On Due Date' &&
          (value.days === 0 || value.days === '')
        ) {
          return false;
        } else {
          return true;
        }
      }
    );

    if (currentReminderData['name'] === '') {
      setErrorMessage('Name cannot be left blank');
      setOpenErrorMesssageDialog(true);
    } else if (
      currentReminderData['type'] === '' ||
      currentReminderData['type'] === 'Select'
    ) {
      setErrorMessage('Type cannot be left blank');
      setOpenErrorMesssageDialog(true);
    } else if (
      !dailyType.includes(currentReminderData['type']) &&
      (currentReminderData['remind'] === '' ||
        currentReminderData['remind'] === 'Select')
    ) {
      setErrorMessage('Remind cannot be left blank');
      setOpenErrorMesssageDialog(true);
    } else if (
      !dailyType.includes(currentReminderData['type']) &&
      (currentReminderData['remindFor'] === '' ||
        currentReminderData['remindFor'] === 'Select')
    ) {
      setErrorMessage('Remind For cannot be left blank');
      setOpenErrorMesssageDialog(true);
    } else if (
      !dailyType.includes(currentReminderData['type']) &&
      currentReminderData['daysList'].length === 0
    ) {
      setErrorMessage('Days cannot be left blank');
      setOpenErrorMesssageDialog(true);
    } else if (
      !dailyType.includes(currentReminderData['type']) &&
      !ReminderDaylistValidate.every(Boolean)
    ) {
      setErrorMessage('Days cannot be 0 or blank');
      setOpenErrorMesssageDialog(true);
    } else if (currentReminderData['message'] === '') {
      setErrorMessage('Message cannot be left blank');
      setOpenErrorMesssageDialog(true);
    } else {
      saveReminderData();
    }
  };

  return (
    <Page className={classes.root} title="Reminder Settings">
      <Container maxWidth={false} style={{ margin: 0, padding: 10 }}>
        <Grid container spacing={1}>
          {isLoading && <BubbleLoader></BubbleLoader>}
          {!isLoading && (
            <>
              {isFeatureAvailable ? (
                <Grid item className={classes.containerRight}>
                  <Paper
                    className={classes.paper}
                    style={{ height: height - 62 + 'px' }}
                  >
                    <Typography variant="h5" style={{ marginBottom: '10px' }}>
                      Reminder Settings
                    </Typography>

                    <Grid item xs={12}>
                      <FormGroup
                        row
                        style={{
                          marginTop: '16px'
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={reminderData.remindByWhatsApp}
                              onChange={(e) => {
                                setReminderByWhatsApp(e.target.checked);
                              }}
                              name="by whatsapp"
                            />
                          }
                          label="WhatsApp"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={reminderData.remindByMail}
                              onChange={(e) => {
                                setReminderByEmail(e.target.checked);
                              }}
                              name="by email"
                            />
                          }
                          label="Email"
                          style={{
                            marginLeft: '10px'
                          }}
                        />
                      </FormGroup>
                    </Grid>

                    <Grid
                      item
                      xs="6"
                      className={classes.primaryImageButtonWrapper}
                    >
                      <Controls.Button
                        text="+ Add Reminder"
                        size="medium"
                        style={{
                          marginTop: '10px',
                          marginBottom: '10px'
                        }}
                        variant="contained"
                        color="primary"
                        className={classes.newButton}
                        onClick={() => addNewReminder()}
                      />
                    </Grid>

                    {reminderData &&
                      reminderData.reminders.length > 0 &&
                      reminderData.reminders.map((rem, RemIndex) => (
                        <div className={classes.reminderList}>
                          <Grid key={rem.name} container>
                            <Grid item xs="6">
                              <FormControlLabel
                                style={{ display: 'block' }}
                                control={
                                  <Switch
                                    checked={rem.reminderOn}
                                    name="reminder_name"
                                    onChange={(e) => {
                                      changeReminderDataStatus(
                                        RemIndex,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                }
                                label={rem.name}
                              />
                            </Grid>
                            <Grid
                              item
                              xs="6"
                              className={classes.primaryImageButtonWrapper}
                            >
                              <EditIcon
                                onClick={(e) => {
                                  editReminderData(RemIndex);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  marginTop: '5px'
                                }}
                                className={classes.icon}
                              />
                              <DeleteIcon
                                onClick={(e) => {
                                  deleteReminderData(RemIndex);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  marginLeft: '16px'
                                }}
                                className={classes.icon}
                              />
                            </Grid>
                          </Grid>
                        </div>
                      ))}
                  </Paper>
                </Grid>
              ) : (
                <NoPermission />
              )}
            </>
          )}
        </Grid>
        <Dialog
          fullWidth={true}
          maxWidth={'sm'}
          open={reminderDialogOpen}
          onClose={handleReminderDialogOpenClose}
        >
          <DialogTitle id="product-modal-title">
            {isReminderEdit ? 'Edit Reminder' : 'Add Reminder'}
            <IconButton
              aria-label="close"
              onClick={handleReminderDialogOpenClose}
              className="closeButton"
            >
              <CancelRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.productModalContent}>
            <Grid container direction="row" alignItems="stretch">
              <Grid item xs={6} className="grid-padding">
                <FormControl>
                  <Typography
                    className={classes.floatlabel}
                    component="subtitle1"
                  >
                    Name
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    name="name"
                    onChange={(event) =>
                      updateReminderData('name', event.target.value)
                    }
                    value={currentReminderData.name}
                    type="text"
                    className="customTextField"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} className="grid-padding">
                <FormControl
                  variant="outlined"
                  style={{ minWidth: 200 }}
                  className={classes.formControl}
                >
                  <Typography
                    className={classes.floatlabel}
                    component="subtitle1"
                  >
                    Type
                  </Typography>
                  <Select
                    displayEmpty
                    fullWidth
                    name="type"
                    onChange={(event) =>
                      updateReminderData('type', event.target.value)
                    }
                    value={
                      currentReminderData.type === ''
                        ? 'Select'
                        : currentReminderData.type
                    }
                    style={{ textAlign: 'center', marginTop: '8px' }}
                  >
                    <MenuItem value={'Select'}>{'Select'}</MenuItem>
                    <MenuItem value={'Payment'}>{'Payment'}</MenuItem>
                    <MenuItem value={'Daily Sale Summary'}>
                      {'Daily Sale Summary'}
                    </MenuItem>
                    <MenuItem value={'Daily Outstanding Payments'}>
                      {'Daily Outstanding Payments'}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {!dailyType.includes(currentReminderData.type) && (
              <Grid
                container
                direction="row"
                style={{ marginTop: 20 }}
                alignItems="stretch"
              >
                <Grid item xs={6} className="grid-padding">
                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 200 }}
                    className={classes.formControl}
                  >
                    <Typography
                      className={classes.floatlabel}
                      component="subtitle1"
                    >
                      Remind
                    </Typography>
                    <Select
                      displayEmpty
                      fullWidth
                      name="remind"
                      onChange={(event) => {
                        if (event.target.value !== 'Select') {
                          updateReminderData('remind', event.target.value);
                        } else {
                          updateReminderData('remind', '');
                        }
                      }}
                      value={
                        currentReminderData.remind === ''
                          ? 'Select'
                          : currentReminderData.remind
                      }
                      style={{ textAlign: 'center', marginTop: '8px' }}
                    >
                      <MenuItem value={'Select'}>{'Select'}</MenuItem>
                      <MenuItem value={'Remind me'}>{'Remind me'}</MenuItem>
                      <MenuItem value={'Remind Customer/Vendor'}>
                        {'Remind Customer/Vendor'}
                      </MenuItem>
                      <MenuItem value={'Remind Customer/Vendor & Copy me'}>
                        {'Remind Customer/Vendor & Copy me'}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} className="grid-padding">
                  <FormControl
                    variant="outlined"
                    style={{ minWidth: 200 }}
                    className={classes.formControl}
                  >
                    <Typography
                      className={classes.floatlabel}
                      component="subtitle1"
                    >
                      Remind For
                    </Typography>
                    <Select
                      displayEmpty
                      fullWidth
                      name="remind_for"
                      onChange={(event) => {
                        if (event.target.value !== 'Select') {
                          updateReminderData('remindFor', event.target.value);
                        } else {
                          updateReminderData('remindFor', '');
                        }
                      }}
                      value={
                        currentReminderData.remindFor === ''
                          ? 'Select'
                          : currentReminderData.remindFor
                      }
                      style={{ textAlign: 'center', marginTop: '8px' }}
                    >
                      <MenuItem value={'Select'}>{'Select'}</MenuItem>
                      <MenuItem value={'Sale'}>{'Sale'}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {!dailyType.includes(currentReminderData.type) && (
              <Grid item className="grid-padding">
                <Controls.Button
                  text="+ Add Day & Due"
                  size="medium"
                  style={{ marginTop: '31px' }}
                  variant="contained"
                  color="primary"
                  className={classes.newButton}
                  onClick={addReminderDay}
                />
              </Grid>
            )}
            {!dailyType.includes(currentReminderData.type) && (
              <div>
                {currentReminderData.daysList?.map((d, DaysIndex) => (
                  <Grid
                    container
                    direction="row"
                    style={{ marginTop: 20 }}
                    alignItems="stretch"
                  >
                    <Grid item xs={4} className="grid-padding">
                      <FormControl>
                        <Typography
                          className={classes.floatlabel}
                          component="subtitle1"
                        >
                          Days
                        </Typography>
                        <TextField
                          required
                          variant="outlined"
                          disabled={
                            d.remindForDays === 'On Due Date' ? true : false
                          }
                          onFocus={(e) =>
                            d.days === 0
                              ? updateReminderDay('days', DaysIndex, '')
                              : ''
                          }
                          onChange={(e) =>
                            updateReminderDay('days', DaysIndex, e.target.value)
                          }
                          margin="dense"
                          type="text"
                          value={d.days}
                          style={{ width: '100px' }}
                          className="customTextField"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} className="grid-padding">
                      <FormControl
                        variant="outlined"
                        style={{ minWidth: 200 }}
                        className={classes.formControl}
                      >
                        <Typography
                          className={classes.floatlabel}
                          component="subtitle1"
                        >
                          Remind For
                        </Typography>
                        <Select
                          displayEmpty
                          fullWidth
                          value={d.remindForDays}
                          onChange={(e) => {
                            if ('On Due Date' === e.target.value) {
                              updateReminderDay('days', DaysIndex, 0);
                            }
                            updateReminderDay(
                              'remindForDays',
                              DaysIndex,
                              e.target.value
                            );
                          }}
                          style={{ textAlign: 'center', marginTop: '8px' }}
                        >
                          <MenuItem value={'Before Due Date'}>
                            {'Before Due Date'}
                          </MenuItem>
                          <MenuItem value={'After Due Date'}>
                            {'After Due Date'}
                          </MenuItem>
                          <MenuItem value={'On Due Date'}>
                            {'On Due Date'}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2} className="grid-padding">
                      <IconButton
                        aria-label="close"
                        style={{ marginTop: '2px' }}
                        onClick={(e) => removeReminderDay(DaysIndex)}
                        className="closeButton"
                      >
                        <CancelRoundedIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </div>
            )}
            <Grid
              container
              direction="row"
              style={{ marginTop: 20 }}
              alignItems="stretch"
            >
              <FormControl style={{ width: '88%' }}>
                <Typography
                  className={classes.floatlabel}
                  component="subtitle1"
                >
                  Recepient Message
                </Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  name="message"
                  multiline={true}
                  minRows={4}
                  onChange={(event) =>
                    updateReminderData('message', event.target.value)
                  }
                  value={currentReminderData.message}
                  type="text"
                  className="customTextField"
                />
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={() => saveReminders()}
              variant="outlined"
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
      </Container>
    </Page>
  );
};

export default injectWithObserver(ReminderSettings);