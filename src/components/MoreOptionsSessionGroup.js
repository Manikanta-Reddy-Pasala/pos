import {
  IconButton,
  Menu,
  MenuItem,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import SessionPreview from './SessionGroup/SessionPreview';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import { getSessionGroupDataById } from './Helpers/dbQueries/sessionGroup';
import ConfirmModal from './modal/ConfirmModal';
import SessionPrint from './SessionGroup/SessionPrint';

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const store = useStore();
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const {
    handleAddSessionDialogOpen,
    updateData,
    handleViewHistory,
    deleteSessionMgmtData,
    deleteSingleSession,
    handleViewSessionDialogOpen,
    handlePaymentHistoryDialogOpen
  } = store.SessionGroupStore;
   const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);

  const [sessionData, setSessionData] = React.useState([]);
  const [sessionAllData, setSessionAllData] = React.useState([]);
  const [openConfirmation, setConfirmation] = React.useState(false);
  const [mode, setMode] = React.useState('');
  const [sessionPrintOption, setSessionPrintOption] = React.useState('all');
  const [individualSession, setIndividualSession] = React.useState();
  const currentDateTime = new Date();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmationClose = () => {
    setConfirmation(false);
  };

  const handleMarkAsCompleted = () => {
    updateData(props.item.sessionGroupId, '', props.item.sessionId, true);
    handleClose();
  };

  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
  };



  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }))(MuiDialogActions);

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2)
    }
  }))(MuiDialogContent);

  const closeDialog = () => {
    setOpenDialog(null);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getSessionGroupDataById(props.item.sessionGroupId);
        if (isMounted) {
          setSessionData(data);
          setSessionAllData(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch session group data:', error);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [props.item.sessionGroupId]);

  const handlePrint = async () => {
    const data = await getSessionGroupDataById(props.item.sessionGroupId);
    setSessionAllData(data);
    if (sessionPrintOption === 'individual') {
      data.sessionList.map((item, index) => {
        if (item.sessionId === individualSession) {
          item.sessionNo = index + 1;
          sessionData.sessionList = [item];
        }
      });
    } else {
      data.sessionList.map((item, index) => {
        item.sessionNo = index + 1;
      });
      sessionData.sessionList = data.sessionList;
    }

    if (mode === 'preview') {
      openpreview();
    } else {
      setOpenDialog('print')
    }
    setIndividualSession();
    setPrintSelectionAlert('all');
    handleConfirmationClose();
  };

  const openPrint = async() => {
    const data = await getSessionGroupDataById(props.item.sessionGroupId);
    setSessionAllData(data);
    if (sessionPrintOption === 'individual') {
      data.sessionList.map((item, index) => {
        if (item.sessionId === individualSession) {
          item.sessionNo = index + 1;
          sessionData.sessionList = [item];
        }
      });
    } else {
      data.sessionList.map((item, index) => {
        item.sessionNo = index + 1;
      });
      sessionData.sessionList = data.sessionList;
    }
    setOpenDialog('print');
    setIndividualSession();
    setPrintSelectionAlert('all');
    handleConfirmationClose();
  };

  const handleConfirmationOpen = (val) => {
    setMode(val);
    setConfirmation(true);
  };

  const handleRadioChange = async (e) => {
    setSessionPrintOption(e.target.value);
    const data = await getSessionGroupDataById(props.item.sessionGroupId);
    setSessionData(data);
    setSessionAllData(data);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      if (props.allSession) {
        deleteSingleSession(props.item);
      } else {
        deleteSessionMgmtData(props.item);
      }
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  function renderMenuItems() {
    return (
      sessionAllData &&
      sessionAllData.sessionList &&
      sessionAllData.sessionList.map((session, i) => (
        <MenuItem key={i} value={session.sessionId}>
          Session {i + 1}{' '}
        </MenuItem>
      ))
    );
  }

  const handleIndividualSession = (value) => {
    setIndividualSession(value);
  };

  const getSessionDateTime = () => {
    return new Date(`${props.item.sessionDate}T${props.item.sessionStartTime}`);
  }

  return (
    <div>
      <div>
        <IconButton onClick={handleClick}>
          <MoreVert fontSize="inherit" />
        </IconButton>
        {isOpenConfirmModal ? (
          <ConfirmModal
            open={isOpenConfirmModal}
            onConfirm={(isConfirm) => confirmDeleteItem(isConfirm)}
            onClose={() => setIsOpenConfirmModal(false)}
          />
        ) : (
          ''
        )}
        {props.isDoctor ? (
          <Menu
            id="moremenu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              key={1}
              onClick={() =>
                handleViewSessionDialogOpen(props.item.sessionGroupId)
              }
            >
              View History{' '}
            </MenuItem>
            {!props.item.sessionNotes.message &&
              (props.item.sessionNotes.imageUrl?.length === 0 ||
                !props.item.sessionNotes.imageUrl) && (
                <MenuItem key={2} onClick={handleAddSessionDialogOpen}>
                  Record Notes{' '}
                </MenuItem>
              )}
            {props.item.status === 'pending' && (getSessionDateTime() < currentDateTime)  && (
              <MenuItem key={3} onClick={handleMarkAsCompleted}>
                Mark as completed{' '}
              </MenuItem>
            )}
            <MenuItem key={4} onClick={() => handleConfirmationOpen('preview')}>
              {' '}
              Preview
            </MenuItem>
            <MenuItem key={5} onClick={() => handleConfirmationOpen('print')}>
              Print{' '}
            </MenuItem>
          </Menu>
        ) : (
          <Menu
            id="moremenu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              key={1}
              onClick={() => handleViewHistory(props.item.sessionGroupId)}
            >
              View/Edit{' '}
            </MenuItem>

            <MenuItem
              key={2}
              onClick={() =>
                handleViewSessionDialogOpen(props.item.sessionGroupId)
              }
            >
              View History{' '}
            </MenuItem>

            <MenuItem
              key={3}
              onClick={() =>
                handlePaymentHistoryDialogOpen(props.item.sessionGroupId)
              }
            >
              Payment History{' '}
            </MenuItem>

            <MenuItem key={4} onClick={() => deleteItem()}>
              Delete{' '}
            </MenuItem>
            <MenuItem key={5} onClick={() => handleConfirmationOpen('preview')}>
              {' '}
              Preview
            </MenuItem>
            <MenuItem key={6} onClick={() => handleConfirmationOpen('print')}>
              Print{' '}
            </MenuItem>
          </Menu>
        )}
        {openDialogName === 'preview' && (
          <SessionPreview
            open={true}
            onClose={closeDialog}
            id={props.id}
            invoiceData={sessionData}
            onPrint={openPrint}
          />
        )}
      </div>
      <Dialog
        open={openDialogName === 'print' ? true : false}
        onClose={closeDialog}
        aria-labelledby="responsive-dialog-title"
        style={{ display: 'none' }}
      >
        <DialogContent>
          <DialogContentText>
           <SessionPrint data={sessionData} printMe={true} onClose={closeDialog} ></SessionPrint>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} color="primary" autoFocus>
            PROCEED TO PRINT
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirmation}
        onClose={handleConfirmationClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="position"
                name="position"
                value={sessionPrintOption}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio color="secondary" />}
                  label="All Sessions"
                />
                <FormControlLabel
                  value="individual"
                  control={<Radio color="secondary" />}
                  label="Individual Session"
                />
              </RadioGroup>
            </FormControl>
            {sessionPrintOption === 'individual' && (
              <FormControl
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '10px'
                }}
              >
                <Select
                  value={individualSession}
                  onChange={(e) => handleIndividualSession(e.target.value)}
                  variant="outlined"
                  style={{
                    minWidth: '200px'
                  }}
                >
                  {renderMenuItems()}
                </Select>
              </FormControl>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePrint} color="secondary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectWithObserver(Moreoptions);