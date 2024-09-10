import {
  IconButton,
  Menu,
  MenuItem,
  Button,
  Typography
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { useEffect } from 'react';
import OpenPreview from './OpenPreview';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import ConfirmModal from './modal/ConfirmModal';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';
import * as Bd from 'src/components/SelectedBusiness';

const API_SERVER = window.REACT_APP_API_SERVER;

function Moreoptions(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialogName, setOpenDialog] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState(false);

  const store = useStore();
  const { viewOrEditItem, deleteVendor } = store.VendorStore;
  const { handleWhatsAppCustomMessageDialogOpen } = store.WhatsAppSettingsStore;
  const [isOpenWhatsAppNotLinkedModal, setWhatsAppNotLinkedModal] =
    React.useState(false);
  const [isWhatsAppLinked, setWhatsAppLinked] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      await getBarcodeData();
    }

    fetchData();
  }, []);

  const getBarcodeData = async () => {
    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    await axios
      .get(API_SERVER + '/pos/v1/user/getBarCode', {
        params: {
          businessId: businessId,
          businessCity: businessCity
        }
      })
      .then(async (response) => {
        if (response) {
          if (response.data) {
            setWhatsAppLinked(response.data.whatsAppLinkedEnabled);
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const deleteItem = () => {
    setIsOpenConfirmModal(true);
  };

  const confirmDeleteItem = (confirm) => {
    if (confirm) {
      deleteVendor(props.item);
      setIsOpenConfirmModal(false);
      setAnchorEl(null);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openpdf = () => {
    setOpenDialog('pdf');
    handleClose();
  };
  const openpreview = () => {
    setOpenDialog('preview');
    handleClose();
  };
  const openprint = () => {
    setIsStartPrint(true);
    openpreview();
  };

  const closeDialog = () => {
    setOpenDialog(null);
  };

  const handleWhatsAppAlertClose = () => {
    setWhatsAppNotLinkedModal(false);
  };

  return (
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

      <Menu
        id="moremenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem key={1} onClick={() => viewOrEditItem(props.item)}>
          View/Edit{' '}
        </MenuItem>

        <MenuItem key={2} onClick={() => deleteItem()}>
          Delete{' '}
        </MenuItem>
        <MenuItem
          key={3}
          onClick={() => {
            if (isWhatsAppLinked) {
              handleWhatsAppCustomMessageDialogOpen(props.item);
            } else {
              setWhatsAppNotLinkedModal(true);
            }
          }}
        >
          Send Message{' '}
        </MenuItem>
      </Menu>

      {openDialogName === 'preview' ? (
        <OpenPreview
          open={openDialogName === 'preview'}
          onClose={closeDialog}
          id={props.id}
          SalesData={props.item}
          startPrint={isStartPrint}
        />
      ) : (
        ''
      )}

      <Dialog
        open={isOpenWhatsAppNotLinkedModal}
        onClose={handleWhatsAppAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <Typography gutterBottom style={{ marginLeft: '10px' }}>
              Please scan QR code from WhatsApp Settings to send custom WhatsApp
              message to your customers.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWhatsAppAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectWithObserver(Moreoptions);